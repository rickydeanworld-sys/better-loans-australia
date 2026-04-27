import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PortalNav } from "@/components/portal/portal-nav"

export const dynamic = "force-dynamic"

export default async function PortalLayout({
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

  return (
    <div className="min-h-screen bg-muted/30">
      <PortalNav user={user} profile={profile} />
      <main className="pb-24 pt-6 md:pb-8 md:pt-8">
        {children}
      </main>
    </div>
  )
}
