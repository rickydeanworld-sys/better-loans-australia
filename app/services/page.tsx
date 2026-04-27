import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  RefreshCw,
  TrendingUp,
  Users,
  Building2,
  Hammer,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

const services = [
  {
    id: "home-loans",
    icon: Home,
    title: "Home Loans",
    description: "Find the perfect home loan with competitive rates from over 38 lenders.",
    image: "/images/service-home-loan.jpg",
    features: [
      "Variable and fixed rate options",
      "Offset accounts available",
      "Redraw facilities",
      "Split loan options",
      "Package deals with fee waivers",
    ],
    details:
      "Whether you're buying your first home or upgrading, we'll compare hundreds of loan products to find the one that best suits your needs and budget.",
  },
  {
    id: "refinancing",
    icon: RefreshCw,
    title: "Refinancing",
    description: "Switch to a better deal and potentially save thousands on your mortgage.",
    image: "/images/service-refinance.jpg",
    features: [
      "Free loan health check",
      "Rate comparison across 38+ lenders",
      "Cashback offers available",
      "Debt consolidation options",
      "We handle the paperwork",
    ],
    details:
      "If you haven't reviewed your home loan in the past 2 years, you could be paying too much. Let us assess your current loan and see if we can find you a better deal.",
  },
  {
    id: "investment",
    icon: TrendingUp,
    title: "Investment Loans",
    description: "Build your property portfolio with expert guidance and tailored solutions.",
    image: "/images/service-investment.jpg",
    features: [
      "Interest-only options",
      "Line of credit facilities",
      "Portfolio structuring advice",
      "Tax-effective strategies",
      "Access to investor-specific products",
    ],
    details:
      "Growing a property portfolio requires the right financing structure. Our investment specialists understand the unique needs of property investors and can help you maximise your borrowing capacity.",
  },
  {
    id: "first-home",
    icon: Users,
    title: "First Home Buyers",
    description: "Navigate your first purchase with confidence and access to government grants.",
    image: "/images/service-home-loan.jpg",
    features: [
      "First Home Owner Grant assistance",
      "First Home Guarantee scheme",
      "Low deposit options from 5%",
      "Stamp duty concession guidance",
      "Step-by-step support",
    ],
    details:
      "Buying your first home is exciting but can feel overwhelming. We specialise in helping first-time buyers understand their options and access government incentives to get into the market sooner.",
  },
  {
    id: "construction",
    icon: Hammer,
    title: "Construction Loans",
    description: "Finance your new build or major renovation with progress payment options.",
    image: "/images/service-home-loan.jpg",
    features: [
      "Progress draw facilities",
      "Fixed price contracts",
      "Cost-plus construction",
      "Land and construction packages",
      "Builder assessment support",
    ],
    details:
      "Building a new home requires a different approach to financing. Our construction loan specialists can guide you through the process and ensure your funding is structured correctly.",
  },
  {
    id: "commercial",
    icon: Building2,
    title: "Commercial Loans",
    description: "Business property finance for offices, retail, and industrial premises.",
    image: "/images/service-commercial.jpg",
    features: [
      "Commercial property purchase",
      "Business expansion funding",
      "SMSF lending options",
      "Competitive commercial rates",
      "Flexible terms available",
    ],
    details:
      "Whether you're buying premises for your business or investing in commercial property, we have access to specialist commercial lenders who can help you secure the right finance.",
  },
]

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Our Services
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Whatever your lending needs, we have the expertise and lender access to find 
                the right solution. From your first home to your property empire, we're 
                here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-24"
                >
                  <div
                    className={`grid items-start gap-8 lg:grid-cols-2 ${
                      index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <service.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                          {service.title}
                        </h2>
                      </div>
                      <p className="mt-4 text-lg text-muted-foreground">{service.description}</p>
                      <p className="mt-4 text-muted-foreground">{service.details}</p>
                      <div className="mt-6">
                        <Button asChild>
                          <Link href="/contact">
                            Enquire About {service.title}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <Card className={`overflow-hidden ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div className="relative h-48">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">Key Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  {index < services.length - 1 && (
                    <div className="mt-16 border-b border-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Not Sure Which Loan Is Right for You?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Our experts will assess your situation and recommend the best options.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">
                    Book a Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/calculator">Try Our Calculator</Link>
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
