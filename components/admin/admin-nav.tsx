"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Users, FileText, MessageSquare, LogOut, ChevronDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
}

interface AdminNavProps {
  user: SupabaseUser
  profile: Profile | null
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/loans", label: "Loans", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
]

export function AdminNav({ user, profile }: AdminNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "A"

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Better Loans Australia"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="hidden sm:block">
                <p className="text-lg font-semibold leading-tight">Better Loans</p>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action */}
            <Button asChild size="sm" className="hidden gap-2 sm:flex">
              <Link href="/admin/loans/new">
                <Plus className="h-4 w-4" />
                New Loan
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-sm text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-medium">{profile?.full_name || "Admin"}</p>
                    <p className="text-xs text-muted-foreground capitalize">{profile?.role || "Admin"}</p>
                  </div>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.full_name || "Admin"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    View Website
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
