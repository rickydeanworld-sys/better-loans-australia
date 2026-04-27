import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin/admin-nav"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Check if user is admin or broker
  if (!profile || !["admin", "broker"].includes(profile.role)) {
    redirect("/portal")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav user={user} profile={profile} />
      <main className="pb-24 pt-6 md:pb-8 md:pt-8">
        {children}
      </main>
    </div>
  )
}
