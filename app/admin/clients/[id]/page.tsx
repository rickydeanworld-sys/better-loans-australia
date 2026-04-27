import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ArrowLeft,
  ArrowRight,
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  FileText,
  Plus
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

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (!client) {
    notFound()
  }

  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {client.full_name || "Unnamed Client"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Client since {formatDate(client.created_at)}
            </p>
          </div>
          <Button asChild>
            <Link href={`/admin/loans/new?client=${id}`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Loan
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{client.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{client.address || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium">{formatDate(client.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Loan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Total Loans</p>
                <p className="text-2xl font-bold">{loans?.length || 0}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(loans?.reduce((sum, l) => sum + Number(l.loan_amount), 0) || 0)}
                </p>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href={`/portal/messages?client=${id}`}>
                Message Client
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Client's Loans */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Loans</CardTitle>
          <CardDescription>All loan applications for this client</CardDescription>
        </CardHeader>
        <CardContent>
          {!loans || loans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">No loans yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a loan application for this client.
              </p>
              <Button asChild className="mt-4">
                <Link href={`/admin/loans/new?client=${id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Loan
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => {
                const status = statusConfig[loan.status] || statusConfig.submitted
                return (
                  <Link
                    key={loan.id}
                    href={`/admin/loans/${loan.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium capitalize">
                          {loan.loan_type.replace("_", " ")} Loan
                        </h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatCurrency(Number(loan.loan_amount))} - {loan.lender_name || "Lender TBD"}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
