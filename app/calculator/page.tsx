"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Info } from "lucide-react"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export default function CalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(6.0)
  const [loanTerm, setLoanTerm] = useState(30)

  const calculations = useMemo(() => {
    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - principal

    const fortnightlyPayment = monthlyPayment / 2
    const weeklyPayment = (monthlyPayment * 12) / 52

    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      fortnightlyPayment: isNaN(fortnightlyPayment) ? 0 : fortnightlyPayment,
      weeklyPayment: isNaN(weeklyPayment) ? 0 : weeklyPayment,
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
    }
  }, [loanAmount, interestRate, loanTerm])

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
                  Loan Repayment Calculator
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                  Estimate your home loan repayments based on loan amount, interest rate, and 
                  loan term. This is a guide only&mdash;contact us for a personalised quote.
                </p>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/images/calculator-hero.jpg"
                    alt="Financial planning"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Input Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Loan Details</CardTitle>
                  <CardDescription>
                    Adjust the sliders to calculate your estimated repayments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Loan Amount */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loan-amount" className="text-base font-medium">
                        Loan Amount
                      </Label>
                      <span className="text-lg font-semibold text-primary">
                        {formatCurrency(loanAmount)}
                      </span>
                    </div>
                    <Slider
                      id="loan-amount"
                      min={100000}
                      max={2000000}
                      step={10000}
                      value={[loanAmount]}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$100k</span>
                      <span>$2M</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="interest-rate" className="text-base font-medium">
                        Interest Rate (p.a.)
                      </Label>
                      <span className="text-lg font-semibold text-primary">
                        {formatPercent(interestRate)}
                      </span>
                    </div>
                    <Slider
                      id="interest-rate"
                      min={2}
                      max={10}
                      step={0.05}
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>2%</span>
                      <span>10%</span>
                    </div>
                  </div>

                  {/* Loan Term */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loan-term" className="text-base font-medium">
                        Loan Term
                      </Label>
                      <span className="text-lg font-semibold text-primary">
                        {loanTerm} years
                      </span>
                    </div>
                    <Slider
                      id="loan-term"
                      min={5}
                      max={30}
                      step={1}
                      value={[loanTerm]}
                      onValueChange={(value) => setLoanTerm(value[0])}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 years</span>
                      <span>30 years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Card */}
              <div className="space-y-6">
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle>Estimated Repayments</CardTitle>
                    <CardDescription>
                      Based on principal and interest repayments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-background p-4 text-center">
                        <p className="text-sm text-muted-foreground">Monthly</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">
                          {formatCurrency(calculations.monthlyPayment)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-background p-4 text-center">
                        <p className="text-sm text-muted-foreground">Fortnightly</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">
                          {formatCurrency(calculations.fortnightlyPayment)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-background p-4 text-center">
                        <p className="text-sm text-muted-foreground">Weekly</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">
                          {formatCurrency(calculations.weeklyPayment)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Loan Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-border pb-3">
                        <span className="text-muted-foreground">Loan Amount</span>
                        <span className="font-medium">{formatCurrency(loanAmount)}</span>
                      </div>
                      <div className="flex justify-between border-b border-border pb-3">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-medium text-destructive">
                          {formatCurrency(calculations.totalInterest)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="font-medium text-foreground">Total Repayment</span>
                        <span className="font-bold text-foreground">
                          {formatCurrency(calculations.totalPayment)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    This calculator provides estimates only. Actual repayments may vary based 
                    on loan features, fees, and lender requirements. Contact us for an 
                    accurate quote.
                  </p>
                </div>

                <Button size="lg" className="w-full" asChild>
                  <Link href="/contact">
                    Get a Personalised Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Want to Know Your True Borrowing Power?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our brokers can assess your full financial situation and tell you exactly 
                how much you can borrow across 38+ lenders.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Book a Free Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
