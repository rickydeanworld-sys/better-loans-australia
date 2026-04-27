"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"

const loanTypes = [
  "Home Loan - Buying",
  "Refinancing",
  "Investment Loan",
  "First Home Buyer",
  "Construction Loan",
  "Commercial Loan",
  "Other / Not Sure",
]

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "1300 BETTER (238 837)",
    href: "tel:1300238837",
  },
  {
    icon: Mail,
    label: "Email",
    value: "Info@betterloansaustralia.com.au",
    href: "mailto:Info@betterloansaustralia.com.au",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "C/of 9/17 Foley Street, Balcatta WA 6021",
    href: null,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon-Fri 9am-6pm, Sat 10am-2pm",
    href: null,
  },
]

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Get in Touch
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                  Ready to find your perfect loan? Fill out the form below and one of our 
                  experienced brokers will be in touch within 24 hours.
                </p>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/images/trust-handshake.jpg"
                    alt="Partnership and trust"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Request a Free Quote</CardTitle>
                    <CardDescription>
                      Tell us about your lending needs and we&apos;ll get back to you with 
                      personalised options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                          <CheckCircle className="h-8 w-8 text-secondary" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-foreground">
                          Thank You!
                        </h3>
                        <p className="mt-2 max-w-sm text-muted-foreground">
                          We&apos;ve received your enquiry and one of our brokers will be in 
                          touch within 24 hours.
                        </p>
                        <Button
                          className="mt-6"
                          variant="outline"
                          onClick={() => setIsSubmitted(false)}
                        >
                          Submit Another Enquiry
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              required
                              placeholder="John"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              required
                              placeholder="Smith"
                            />
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              placeholder="john@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              required
                              placeholder="0400 123 456"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="loanType">What type of loan are you looking for? *</Label>
                          <Select name="loanType" required>
                            <SelectTrigger id="loanType">
                              <SelectValue placeholder="Select loan type" />
                            </SelectTrigger>
                            <SelectContent>
                              {loanTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="loanAmount">Approximate Loan Amount</Label>
                            <Input
                              id="loanAmount"
                              name="loanAmount"
                              placeholder="e.g. $500,000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="timeframe">When do you need the loan?</Label>
                            <Select name="timeframe">
                              <SelectTrigger id="timeframe">
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="asap">As soon as possible</SelectItem>
                                <SelectItem value="1-3months">1-3 months</SelectItem>
                                <SelectItem value="3-6months">3-6 months</SelectItem>
                                <SelectItem value="6plus">6+ months</SelectItem>
                                <SelectItem value="justlooking">Just exploring options</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Additional Information</Label>
                          <Textarea
                            id="message"
                            name="message"
                            rows={4}
                            placeholder="Tell us more about your situation and goals..."
                          />
                        </div>

                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-sm text-muted-foreground">
                            By submitting this form, you agree to be contacted by Better Loans 
                            Australia regarding your enquiry. Your information will be handled 
                            in accordance with our privacy policy.
                          </p>
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contactInfo.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm text-muted-foreground hover:text-primary"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm text-muted-foreground">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold">Prefer to Talk?</h3>
                    <p className="mt-2 text-sm text-primary-foreground/80">
                      Call us directly and speak with a broker today. No waiting, no callbacks.
                    </p>
                    <a
                      href="tel:1300238837"
                      className="mt-4 inline-block text-2xl font-bold hover:underline"
                    >
                      1300 BETTER
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground">Why Choose Us?</h3>
                    <ul className="mt-4 space-y-3">
                      {[
                        "Access to 38+ lenders",
                        "Free service for borrowers",
                        "Fast pre-approvals",
                        "Expert guidance",
                        "No hidden fees",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-secondary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
