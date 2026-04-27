import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ArrowRight, Users } from "lucide-react"

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default async function AdminClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false })

  // Get loan counts for each client
  const clientIds = clients?.map(c => c.id) || []
  const { data: loans } = await supabase
    .from("loans")
    .select("client_id")
    .in("client_id", clientIds)

  const loanCounts: Record<string, number> = {}
  loans?.forEach(loan => {
    loanCounts[loan.client_id] = (loanCounts[loan.client_id] || 0) + 1
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Clients</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your client database
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>
            {clients?.length || 0} registered clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!clients || clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">No clients yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Clients will appear here when they sign up.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Loans</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.full_name || "Unnamed"}
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || "-"}</TableCell>
                      <TableCell>{loanCounts[client.id] || 0}</TableCell>
                      <TableCell>{formatDate(client.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/clients/${client.id}`}>
                            View
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
