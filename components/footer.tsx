import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"

const footerLinks = {
  services: [
    { href: "/services#home-loans", label: "Home Loans" },
    { href: "/services#refinancing", label: "Refinancing" },
    { href: "/services#investment", label: "Investment Loans" },
    { href: "/services#first-home", label: "First Home Buyers" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/calculator", label: "Loan Calculator" },
    { href: "/contact", label: "Contact" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpeg"
                alt="Better Loans Australia"
                width={44}
                height={44}
                className="rounded-lg"
              />
              <div>
                <p className="text-lg font-bold">Better Loans</p>
                <p className="text-xs text-background/70">Australia</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-background/70">
              Expert mortgage brokers helping Australians find the right home loan since 2010.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:1300238837"
                  className="flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
                >
                  <Phone className="h-4 w-4" />
                  1300 BETTER (238 837)
                </a>
              </li>
              <li>
                <a
                  href="mailto:Info@betterloansaustralia.com.au"
                  className="flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
                >
                  <Mail className="h-4 w-4" />
                  Info@betterloansaustralia.com.au
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-background/70">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>C/of 9/17 Foley Street<br />Balcatta WA 6021</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-background/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-background/60">
              &copy; {new Date().getFullYear()} Better Loans Australia. All rights reserved.
            </p>
            <p className="text-center text-xs text-background/50">
              Trading under Charter Mortgage & Finance Pty Ltd | Australian Credit Licence No. 393230
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
