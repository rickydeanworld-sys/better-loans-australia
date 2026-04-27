"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, User } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/calculator", label: "Calculator" },
  { href: "/contact", label: "Contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="Better Loans Australia"
            width={44}
            height={44}
            className="rounded-lg"
          />
          <div className="hidden sm:block">
            <p className="text-lg font-bold text-foreground">Better Loans</p>
            <p className="text-xs text-muted-foreground">Australia</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:1300238837"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            1300 BETTER
          </a>
          <Button asChild variant="outline" size="sm">
            <Link href="/auth/login">
              <User className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:1300238837"
              className="mt-2 flex items-center gap-2 rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Phone className="h-5 w-5" />
              1300 BETTER
            </a>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-5 w-5" />
              Login to Portal
            </Link>
            <div className="mt-4 px-4">
              <Button asChild className="w-full">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
