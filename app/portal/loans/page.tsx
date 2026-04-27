import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  DollarSign, 
  TrendingDown, 
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2 }> = {
  submitted: { label: "Submitted", variant: "secondary", icon: Clock },
  in_review: { label: "In Review", variant: "secondary", icon: Clock },
  approved: { label: "Approved", variant: "default", icon: CheckCircle2 },
  conditional: { label: "Conditional Approval", variant: "outline", icon: AlertCircle },
  settled: { label: "Settled", variant: "default", icon: CheckCircle2 },
  declined: { label: "Declined", variant: "destructive", icon: AlertCircle },
}

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

export default async function LoansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Loans</h1>
        <p className="mt-1 text-muted-foreground">
          View and track all your loan applications
        </p>
      </div>

      {!loans || loans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-xl font-medium">No loans yet</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Your loan applications will appear here once your broker sets them up for you.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => {
            const status = statusConfig[loan.status] || statusConfig.submitted
            const StatusIcon = status.icon
            return (
              <Link
                key={loan.id}
                href={`/portal/loans/${loan.id}`}
                className="block"
              >
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold capitalize">
                            {loan.loan_type.replace("_", " ")} Loan
                          </h3>
                          <Badge variant={status.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                        
                        {loan.property_address && (
                          <p className="mt-1 text-muted-foreground">
                            {loan.property_address}
                          </p>
                        )}

                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Loan Amount</p>
                            <p className="text-lg font-semibold">
                              {formatCurrency(Number(loan.loan_amount))}
                            </p>
                          </div>
                          
                          {loan.interest_rate && (
                            <div>
                              <p className="text-sm text-muted-foreground">Interest Rate</p>
                              <p className="text-lg font-semibold">
                                {formatRate(Number(loan.interest_rate))}
                              </p>
                            </div>
                          )}

                          {loan.monthly_repayment && (
                            <div>
                              <p className="text-sm text-muted-foreground">Monthly Payment</p>
                              <p className="text-lg font-semibold">
                                {formatCurrency(Number(loan.monthly_repayment))}
                              </p>
                            </div>
                          )}

                          {loan.lender_name && (
                            <div>
                              <p className="text-sm text-muted-foreground">Lender</p>
                              <p className="text-lg font-semibold">{loan.lender_name}</p>
                            </div>
                          )}
                        </div>

                        {loan.estimated_savings && Number(loan.estimated_savings) > 0 && (
                          <div className="mt-4 flex items-center gap-2 text-green-600">
                            <TrendingDown className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Saving {formatCurrency(Number(loan.estimated_savings))}/year
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
