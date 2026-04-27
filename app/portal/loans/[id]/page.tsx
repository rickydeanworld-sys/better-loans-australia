import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { 
  ArrowLeft,
  DollarSign, 
  TrendingDown, 
  Calendar,
  Building2,
  Percent,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  MessageSquare
} from "lucide-react"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2; color: string }> = {
  submitted: { label: "Submitted", variant: "secondary", icon: Clock, color: "bg-gray-500" },
  in_review: { label: "In Review", variant: "secondary", icon: Clock, color: "bg-blue-500" },
  approved: { label: "Approved", variant: "default", icon: CheckCircle2, color: "bg-green-500" },
  conditional: { label: "Conditional Approval", variant: "outline", icon: AlertCircle, color: "bg-yellow-500" },
  settled: { label: "Settled", variant: "default", icon: CheckCircle2, color: "bg-green-600" },
  declined: { label: "Declined", variant: "destructive", icon: AlertCircle, color: "bg-red-500" },
}

const statusOrder = ["submitted", "in_review", "conditional", "approved", "settled"]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: loan } = await supabase
    .from("loans")
    .select("*")
    .eq("id", id)
    .eq("client_id", user.id)
    .single()

  if (!loan) {
    notFound()
  }

  // Fetch loan updates/timeline
  const { data: updates } = await supabase
    .from("loan_updates")
    .select("*")
    .eq("loan_id", id)
    .order("created_at", { ascending: false })

  const status = statusConfig[loan.status] || statusConfig.submitted
  const StatusIcon = status.icon
  const currentStatusIndex = statusOrder.indexOf(loan.status)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/portal/loans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loans
          </Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold capitalize sm:text-3xl">
              {loan.loan_type.replace("_", " ")} Loan
            </h1>
            {loan.property_address && (
              <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {loan.property_address}
              </p>
            )}
          </div>
          <Badge variant={status.variant} className="gap-1 text-sm">
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Status Timeline */}
      {loan.status !== "declined" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Application Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {statusOrder.map((statusKey, index) => {
                const stepStatus = statusConfig[statusKey]
                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                return (
                  <div key={statusKey} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white sm:h-10 sm:w-10 ${
                          isCompleted ? stepStatus.color : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <span className="text-xs text-gray-500">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`mt-2 text-center text-xs sm:text-sm ${
                          isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {stepStatus.label}
                      </span>
                    </div>
                    {index < statusOrder.length - 1 && (
                      <div
                        className={`mx-2 h-1 flex-1 rounded ${
                          index < currentStatusIndex ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Loan Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Loan Amount
              </span>
              <span className="font-semibold">{formatCurrency(Number(loan.loan_amount))}</span>
            </div>
            
            {loan.interest_rate && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Percent className="h-4 w-4" />
                  Interest Rate
                </span>
                <span className="font-semibold">{formatRate(Number(loan.interest_rate))}</span>
              </div>
            )}

            {loan.loan_term_years && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Loan Term
                </span>
                <span className="font-semibold">{loan.loan_term_years} years</span>
              </div>
            )}

            {loan.monthly_repayment && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Monthly Payment
                </span>
                <span className="font-semibold">{formatCurrency(Number(loan.monthly_repayment))}</span>
              </div>
            )}

            {loan.lender_name && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Lender
                </span>
                <span className="font-semibold">{loan.lender_name}</span>
              </div>
            )}

            {loan.settlement_date && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Settlement Date
                </span>
                <span className="font-semibold">{formatDate(loan.settlement_date)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Savings</CardTitle>
            <CardDescription>Compared to your previous loan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loan.previous_rate && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Previous Rate</span>
                <span className="font-semibold">{formatRate(Number(loan.previous_rate))}</span>
              </div>
            )}
            
            {loan.interest_rate && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">New Rate</span>
                <span className="font-semibold text-green-600">
                  {formatRate(Number(loan.interest_rate))}
                </span>
              </div>
            )}

            {loan.previous_lender && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Previous Lender</span>
                <span className="font-semibold">{loan.previous_lender}</span>
              </div>
            )}

            {loan.estimated_savings && Number(loan.estimated_savings) > 0 && (
              <>
                <Separator />
                <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/30">
                  <TrendingDown className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <p className="text-sm text-muted-foreground">Estimated Annual Savings</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(Number(loan.estimated_savings))}
                  </p>
                </div>
              </>
            )}

            {!loan.estimated_savings && !loan.previous_rate && (
              <div className="py-4 text-center text-muted-foreground">
                <p>Savings information will be updated by your broker.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      {updates && updates.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {updates.map((update, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Broker */}
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
          <div>
            <h3 className="font-semibold">Have questions about this loan?</h3>
            <p className="text-sm text-muted-foreground">
              Your broker is here to help with any questions or concerns.
            </p>
          </div>
          <Button asChild>
            <Link href="/portal/messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Broker
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
