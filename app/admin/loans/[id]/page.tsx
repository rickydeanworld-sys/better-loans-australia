"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Plus
} from "lucide-react"

interface Loan {
  id: string
  client_id: string
  loan_type: string
  loan_amount: number
  interest_rate: number | null
  loan_term_years: number | null
  monthly_repayment: number | null
  lender_name: string | null
  property_address: string | null
  property_value: number | null
  previous_rate: number | null
  previous_lender: string | null
  estimated_savings: number | null
  status: string
  settlement_date: string | null
  notes: string | null
  created_at: string
  client?: {
    full_name: string | null
    email: string
  }
}

interface LoanUpdate {
  id: string
  status: string
  message: string | null
  created_at: string
  created_by: string | null
}

const statusOptions = [
  { value: "submitted", label: "Submitted" },
  { value: "in_review", label: "In Review" },
  { value: "conditional", label: "Conditional Approval" },
  { value: "approved", label: "Approved" },
  { value: "settled", label: "Settled" },
  { value: "declined", label: "Declined" },
]

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
  submitted: { variant: "secondary" },
  in_review: { variant: "secondary" },
  approved: { variant: "default" },
  conditional: { variant: "outline" },
  settled: { variant: "default" },
  declined: { variant: "destructive" },
}

export default function AdminLoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [loan, setLoan] = useState<Loan | null>(null)
  const [updates, setUpdates] = useState<LoanUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    status: "",
    interest_rate: "",
    loan_term_years: "",
    monthly_repayment: "",
    lender_name: "",
    property_address: "",
    property_value: "",
    previous_rate: "",
    previous_lender: "",
    estimated_savings: "",
    settlement_date: "",
    notes: "",
  })

  const [newUpdate, setNewUpdate] = useState({
    status: "",
    message: "",
  })

  useEffect(() => {
    const fetchLoan = async () => {
      const { data: loanData } = await supabase
        .from("loans")
        .select(`
          *,
          client:profiles!loans_client_id_fkey(full_name, email)
        `)
        .eq("id", id)
        .single()

      if (loanData) {
        setLoan(loanData)
        setFormData({
          status: loanData.status,
          interest_rate: loanData.interest_rate ? String(Number(loanData.interest_rate) * 100) : "",
          loan_term_years: loanData.loan_term_years ? String(loanData.loan_term_years) : "",
          monthly_repayment: loanData.monthly_repayment ? String(loanData.monthly_repayment) : "",
          lender_name: loanData.lender_name || "",
          property_address: loanData.property_address || "",
          property_value: loanData.property_value ? String(loanData.property_value) : "",
          previous_rate: loanData.previous_rate ? String(Number(loanData.previous_rate) * 100) : "",
          previous_lender: loanData.previous_lender || "",
          estimated_savings: loanData.estimated_savings ? String(loanData.estimated_savings) : "",
          settlement_date: loanData.settlement_date || "",
          notes: loanData.notes || "",
        })
      }

      const { data: updatesData } = await supabase
        .from("loan_updates")
        .select("*")
        .eq("loan_id", id)
        .order("created_at", { ascending: false })

      if (updatesData) {
        setUpdates(updatesData)
      }

      setIsLoading(false)
    }

    fetchLoan()
  }, [supabase, id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSaving(true)

    try {
      const updateData = {
        status: formData.status,
        interest_rate: formData.interest_rate ? Number(formData.interest_rate) / 100 : null,
        loan_term_years: formData.loan_term_years ? Number(formData.loan_term_years) : null,
        monthly_repayment: formData.monthly_repayment ? Number(formData.monthly_repayment) : null,
        lender_name: formData.lender_name || null,
        property_address: formData.property_address || null,
        property_value: formData.property_value ? Number(formData.property_value) : null,
        previous_rate: formData.previous_rate ? Number(formData.previous_rate) / 100 : null,
        previous_lender: formData.previous_lender || null,
        estimated_savings: formData.estimated_savings ? Number(formData.estimated_savings) : null,
        settlement_date: formData.settlement_date || null,
        notes: formData.notes || null,
      }

      const { error: updateError } = await supabase
        .from("loans")
        .update(updateData)
        .eq("id", id)

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("An error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddUpdate = async () => {
    if (!newUpdate.status.trim()) return

    const { data: { user } } = await supabase.auth.getUser()

    const { error: insertError } = await supabase
      .from("loan_updates")
      .insert({
        loan_id: id,
        status: newUpdate.status,
        message: newUpdate.message || null,
        created_by: user?.id,
      })

    if (!insertError) {
      // Refresh updates
      const { data: updatesData } = await supabase
        .from("loan_updates")
        .select("*")
        .eq("loan_id", id)
        .order("created_at", { ascending: false })

      if (updatesData) {
        setUpdates(updatesData)
      }

      setNewUpdate({ status: "", message: "" })
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!loan) {
    return (
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p>Loan not found</p>
        <Button asChild className="mt-4">
          <Link href="/admin/loans">Back to Loans</Link>
        </Button>
      </div>
    )
  }

  const status = statusConfig[loan.status] || statusConfig.submitted

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/loans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loans
          </Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold capitalize sm:text-3xl">
                {loan.loan_type.replace("_", " ")} Loan
              </h1>
              <Badge variant={status.variant}>
                {statusOptions.find(s => s.value === loan.status)?.label}
              </Badge>
            </div>
            <Link 
              href={`/admin/clients/${loan.client_id}`}
              className="mt-1 flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              {loan.client?.full_name || loan.client?.email}
            </Link>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(Number(loan.loan_amount))}</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Loan updated successfully!</AlertDescription>
            </Alert>
          )}

          {/* Status & Core Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Lender</FieldLabel>
                    <Input
                      value={formData.lender_name}
                      onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
                      placeholder="Commonwealth Bank"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Interest Rate (%)</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.interest_rate}
                      onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                      placeholder="5.99"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Loan Term (years)</FieldLabel>
                    <Input
                      type="number"
                      value={formData.loan_term_years}
                      onChange={(e) => setFormData({ ...formData, loan_term_years: e.target.value })}
                      placeholder="30"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Monthly Repayment ($)</FieldLabel>
                    <Input
                      type="number"
                      value={formData.monthly_repayment}
                      onChange={(e) => setFormData({ ...formData, monthly_repayment: e.target.value })}
                      placeholder="2500"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Settlement Date</FieldLabel>
                    <Input
                      type="date"
                      value={formData.settlement_date}
                      onChange={(e) => setFormData({ ...formData, settlement_date: e.target.value })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Property */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>Property Address</FieldLabel>
                  <Input
                    value={formData.property_address}
                    onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                    placeholder="123 Main St, Sydney NSW 2000"
                  />
                </Field>

                <Field>
                  <FieldLabel>Property Value ($)</FieldLabel>
                  <Input
                    type="number"
                    value={formData.property_value}
                    onChange={(e) => setFormData({ ...formData, property_value: e.target.value })}
                    placeholder="750000"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Savings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Savings (Refinance)</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Previous Lender</FieldLabel>
                    <Input
                      value={formData.previous_lender}
                      onChange={(e) => setFormData({ ...formData, previous_lender: e.target.value })}
                      placeholder="ANZ"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Previous Rate (%)</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.previous_rate}
                      onChange={(e) => setFormData({ ...formData, previous_rate: e.target.value })}
                      placeholder="6.50"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Estimated Annual Savings ($)</FieldLabel>
                  <Input
                    type="number"
                    value={formData.estimated_savings}
                    onChange={(e) => setFormData({ ...formData, estimated_savings: e.target.value })}
                    placeholder="3000"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Internal notes..."
                  rows={4}
                />
              </Field>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>

      <Separator className="my-8" />

      {/* Timeline Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
          <CardDescription>Updates visible to the client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4 rounded-lg border p-4">
            <h4 className="font-medium">Add Status Update</h4>
            <FieldGroup>
              <Field>
                <FieldLabel>Status Title</FieldLabel>
                <Input
                  placeholder="e.g., Documents Received"
                  value={newUpdate.status}
                  onChange={(e) => setNewUpdate({ ...newUpdate, status: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Message (optional)</FieldLabel>
                <Textarea
                  placeholder="Additional details for the client..."
                  value={newUpdate.message}
                  onChange={(e) => setNewUpdate({ ...newUpdate, message: e.target.value })}
                  rows={2}
                />
              </Field>
              <Button
                type="button"
                onClick={handleAddUpdate}
                disabled={!newUpdate.status.trim()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Update
              </Button>
            </FieldGroup>
          </div>

          <div className="space-y-4">
            {updates.length === 0 ? (
              <p className="text-center text-muted-foreground">No updates yet</p>
            ) : (
              updates.map((update, index) => (
                <div key={update.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    {index < updates.length - 1 && (
                      <div className="my-2 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium">{update.status}</p>
                    {update.message && (
                      <p className="mt-1 text-sm text-muted-foreground">{update.message}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(update.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
