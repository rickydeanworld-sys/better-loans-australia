import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Users, 
  FileText, 
  DollarSign,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp
} from "lucide-react"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  submitted: { label: "Submitted", variant: "secondary" },
  in_review: { label: "In Review", variant: "secondary" },
  approved: { label: "Approved", variant: "default" },
  conditional: { label: "Conditional", variant: "outline" },
  settled: { label: "Settled", variant: "default" },
  declined: { label: "Declined", variant: "destructive" },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const { count: totalClients } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "client")

  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .order("created_at", { ascending: false })

  const { count: unreadMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  // Calculate stats
  const totalLoans = loans?.length || 0
  const totalLoanValue = loans?.reduce((sum, loan) => sum + Number(loan.loan_amount), 0) || 0
  const pendingLoans = loans?.filter(loan => ["submitted", "in_review"].includes(loan.status)) || []
  const settledLoans = loans?.filter(loan => loan.status === "settled") || []

  // Recent loans
  const recentLoans = loans?.slice(0, 5) || []

  // Fetch recent clients
  const { data: recentClients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage clients, loans, and communications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <p className="text-2xl font-bold">{totalClients || 0}</p>
            </div>
          </CardContent>
        </Card>

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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(totalLoanValue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
              <MessageSquare className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unread Messages</p>
              <p className="text-2xl font-bold">{unreadMessages || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="flex items-center gap-4 p-4">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-600">{pendingLoans.length}</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-500">Pending Review</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardContent className="flex items-center gap-4 p-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">{settledLoans.length}</p>
              <p className="text-sm text-green-700 dark:text-green-500">Settled This Month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="flex items-center gap-4 p-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(settledLoans.reduce((sum, loan) => sum + Number(loan.loan_amount), 0))}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-500">Settled Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Loans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Loans</CardTitle>
              <CardDescription>Latest loan applications</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/loans">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentLoans.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No loans yet</p>
            ) : (
              <div className="space-y-4">
                {recentLoans.map((loan) => {
                  const status = statusConfig[loan.status] || statusConfig.submitted
                  return (
                    <Link
                      key={loan.id}
                      href={`/admin/loans/${loan.id}`}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {loan.loan_type.replace("_", " ")} - {formatCurrency(Number(loan.loan_amount))}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {loan.property_address || "No address"}
                        </p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>Newly registered clients</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/clients">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!recentClients || recentClients.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No clients yet</p>
            ) : (
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <Link
                    key={client.id}
                    href={`/admin/clients/${client.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{client.full_name || "Unnamed"}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
