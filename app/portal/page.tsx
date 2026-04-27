import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  DollarSign, 
  TrendingDown, 
  Calendar, 
  FileText, 
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle
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

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's loans
  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch unread messages count
  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("is_read", false)

  // Calculate totals
  const totalLoans = loans?.length || 0
  const totalLoanAmount = loans?.reduce((sum, loan) => sum + Number(loan.loan_amount), 0) || 0
  const totalSavings = loans?.reduce((sum, loan) => sum + (Number(loan.estimated_savings) || 0), 0) || 0
  const activeLoans = loans?.filter(loan => loan.status !== "declined") || []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's an overview of your loans.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Loans</p>
              <p className="text-2xl font-bold">{totalLoans}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Borrowed</p>
              <p className="text-2xl font-bold">{formatCurrency(totalLoanAmount)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <TrendingDown className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. Savings</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSavings)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unread Messages</p>
              <p className="text-2xl font-bold">{unreadCount || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Loans */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Loans</CardTitle>
                <CardDescription>Track the status of your loan applications</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/portal/loans">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeLoans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium">No loans yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your loan applications will appear here once your broker sets them up.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeLoans.slice(0, 3).map((loan) => {
                    const status = statusConfig[loan.status] || statusConfig.submitted
                    const StatusIcon = status.icon
                    return (
                      <Link
                        key={loan.id}
                        href={`/portal/loans/${loan.id}`}
                        className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium capitalize">
                                {loan.loan_type.replace("_", " ")} Loan
                              </h3>
                              <Badge variant={status.variant} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                            </div>
                            {loan.property_address && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {loan.property_address}
                              </p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                {formatCurrency(Number(loan.loan_amount))}
                              </span>
                              {loan.interest_rate && (
                                <span className="flex items-center gap-1">
                                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                                  {formatRate(Number(loan.interest_rate))}
                                </span>
                              )}
                              {loan.lender_name && (
                                <span className="text-muted-foreground">
                                  {loan.lender_name}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/portal/messages">
                  <MessageSquare className="h-4 w-4" />
                  Message Your Broker
                  {unreadCount && unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/portal/loans">
                  <FileText className="h-4 w-4" />
                  View All Loans
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/calculator">
                  <Calendar className="h-4 w-4" />
                  Loan Calculator
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Savings Highlight */}
          {totalSavings > 0 && (
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-900">
              <CardContent className="p-6 text-center">
                <TrendingDown className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <p className="text-sm text-muted-foreground">Your Estimated Savings</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalSavings)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Compared to your previous rates
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
