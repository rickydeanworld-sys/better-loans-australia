import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { ArrowRight, FileText, Plus } from "lucide-react"

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

export default async function AdminLoansPage() {
  const supabase = await createClient()

  const { data: loans } = await supabase
    .from("loans")
    .select(`
      *,
      client:profiles!loans_client_id_fkey(full_name, email)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Loans</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all loan applications
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/loans/new">
            <Plus className="mr-2 h-4 w-4" />
            New Loan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Loans</CardTitle>
          <CardDescription>
            {loans?.length || 0} total loans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loans || loans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">No loans yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first loan application.
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/loans/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Loan
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Lender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => {
                    const status = statusConfig[loan.status] || statusConfig.submitted
                    return (
                      <TableRow key={loan.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{loan.client?.full_name || "Unnamed"}</p>
                            <p className="text-sm text-muted-foreground">{loan.client?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{loan.loan_type.replace("_", " ")}</TableCell>
                        <TableCell>{formatCurrency(Number(loan.loan_amount))}</TableCell>
                        <TableCell>{loan.lender_name || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(loan.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/loans/${loan.id}`}>
                              Edit
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
