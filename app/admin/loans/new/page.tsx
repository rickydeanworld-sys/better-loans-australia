"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"

interface Client {
  id: string
  full_name: string | null
  email: string
}

export default function NewLoanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedClient = searchParams.get("client")
  const supabase = createClient()

  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    client_id: preselectedClient || "",
    loan_type: "home",
    loan_amount: "",
    interest_rate: "",
    loan_term_years: "",
    monthly_repayment: "",
    lender_name: "",
    property_address: "",
    property_value: "",
    previous_rate: "",
    previous_lender: "",
    estimated_savings: "",
    notes: "",
  })

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "client")
        .order("full_name")

      if (data) {
        setClients(data)
      }
      setIsLoading(false)
    }

    fetchClients()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.client_id) {
      setError("Please select a client")
      return
    }

    if (!formData.loan_amount || Number(formData.loan_amount) <= 0) {
      setError("Please enter a valid loan amount")
      return
    }

    setIsSaving(true)

    try {
      const loanData = {
        client_id: formData.client_id,
        loan_type: formData.loan_type,
        loan_amount: Number(formData.loan_amount),
        interest_rate: formData.interest_rate ? Number(formData.interest_rate) / 100 : null,
        loan_term_years: formData.loan_term_years ? Number(formData.loan_term_years) : null,
        monthly_repayment: formData.monthly_repayment ? Number(formData.monthly_repayment) : null,
        lender_name: formData.lender_name || null,
        property_address: formData.property_address || null,
        property_value: formData.property_value ? Number(formData.property_value) : null,
        previous_rate: formData.previous_rate ? Number(formData.previous_rate) / 100 : null,
        previous_lender: formData.previous_lender || null,
        estimated_savings: formData.estimated_savings ? Number(formData.estimated_savings) : null,
        notes: formData.notes || null,
        status: "submitted",
      }

      const { data, error: insertError } = await supabase
        .from("loans")
        .insert(loanData)
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        return
      }

      // Create initial status update
      if (data) {
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from("loan_updates").insert({
          loan_id: data.id,
          status: "Application Submitted",
          message: "Loan application has been created.",
          created_by: user?.id,
        })
      }

      router.push(`/admin/loans/${data.id}`)
    } catch {
      setError("An error occurred while creating the loan")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/loans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loans
          </Link>
        </Button>
        <h1 className="text-2xl font-bold sm:text-3xl">New Loan Application</h1>
        <p className="mt-1 text-muted-foreground">
          Create a new loan application for a client
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Client Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client</CardTitle>
              <CardDescription>Select the client for this loan</CardDescription>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel htmlFor="client">Client</FieldLabel>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.full_name || client.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Details</CardTitle>
              <CardDescription>Enter the loan information</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="loan_type">Loan Type</FieldLabel>
                    <Select
                      value={formData.loan_type}
                      onValueChange={(value) => setFormData({ ...formData, loan_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home Loan</SelectItem>
                        <SelectItem value="investment">Investment Loan</SelectItem>
                        <SelectItem value="refinance">Refinance</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="loan_amount">Loan Amount ($)</FieldLabel>
                    <Input
                      id="loan_amount"
                      type="number"
                      placeholder="500000"
                      value={formData.loan_amount}
                      onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="interest_rate">Interest Rate (%)</FieldLabel>
                    <Input
                      id="interest_rate"
                      type="number"
                      step="0.01"
                      placeholder="5.99"
                      value={formData.interest_rate}
                      onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="loan_term_years">Loan Term (years)</FieldLabel>
                    <Input
                      id="loan_term_years"
                      type="number"
                      placeholder="30"
                      value={formData.loan_term_years}
                      onChange={(e) => setFormData({ ...formData, loan_term_years: e.target.value })}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="monthly_repayment">Monthly Repayment ($)</FieldLabel>
                    <Input
                      id="monthly_repayment"
                      type="number"
                      placeholder="2500"
                      value={formData.monthly_repayment}
                      onChange={(e) => setFormData({ ...formData, monthly_repayment: e.target.value })}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lender_name">Lender</FieldLabel>
                    <Input
                      id="lender_name"
                      type="text"
                      placeholder="Commonwealth Bank"
                      value={formData.lender_name}
                      onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="property_address">Property Address</FieldLabel>
                  <Input
                    id="property_address"
                    type="text"
                    placeholder="123 Main St, Sydney NSW 2000"
                    value={formData.property_address}
                    onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="property_value">Property Value ($)</FieldLabel>
                  <Input
                    id="property_value"
                    type="number"
                    placeholder="750000"
                    value={formData.property_value}
                    onChange={(e) => setFormData({ ...formData, property_value: e.target.value })}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Refinance Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Previous Loan (if refinancing)</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="previous_lender">Previous Lender</FieldLabel>
                    <Input
                      id="previous_lender"
                      type="text"
                      placeholder="ANZ"
                      value={formData.previous_lender}
                      onChange={(e) => setFormData({ ...formData, previous_lender: e.target.value })}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="previous_rate">Previous Rate (%)</FieldLabel>
                    <Input
                      id="previous_rate"
                      type="number"
                      step="0.01"
                      placeholder="6.50"
                      value={formData.previous_rate}
                      onChange={(e) => setFormData({ ...formData, previous_rate: e.target.value })}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="estimated_savings">Estimated Annual Savings ($)</FieldLabel>
                  <Input
                    id="estimated_savings"
                    type="number"
                    placeholder="3000"
                    value={formData.estimated_savings}
                    onChange={(e) => setFormData({ ...formData, estimated_savings: e.target.value })}
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
                <FieldLabel htmlFor="notes">Internal Notes</FieldLabel>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this loan application..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </Field>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button asChild variant="outline" type="button">
              <Link href="/admin/loans">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Loan"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
