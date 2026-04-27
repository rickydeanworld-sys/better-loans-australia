import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { PromoBanner } from "@/components/promo-banner"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Home,
  RefreshCw,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Calculator,
} from "lucide-react"

const services = [
  {
    icon: Home,
    title: "Home Loans",
    description: "Find the perfect home loan with competitive rates from over 38 lenders.",
    image: "/images/service-home-loan.jpg",
  },
  {
    icon: RefreshCw,
    title: "Refinancing",
    description: "Switch to a better deal and potentially save thousands on your mortgage.",
    image: "/images/service-refinance.jpg",
  },
  {
    icon: TrendingUp,
    title: "Investment Loans",
    description: "Build your property portfolio with expert guidance and tailored solutions.",
    image: "/images/service-investment.jpg",
  },
  {
    icon: Users,
    title: "Commercial Loans",
    description: "Finance for business premises and commercial property investments.",
    image: "/images/service-commercial.jpg",
  },
]

const features = [
  {
    icon: Shield,
    title: "38+ Lenders",
    description: "Access to Australia's leading banks and lenders",
  },
  {
    icon: Clock,
    title: "Fast Approvals",
    description: "Pre-approval in as little as 24 hours",
  },
  {
    icon: Star,
    title: "No Cost to You",
    description: "Our service is completely free for borrowers",
  },
  {
    icon: Calculator,
    title: "Expert Advice",
    description: "Personalised guidance every step of the way",
  },
]

const testimonials = [
  {
    name: "Gary Crabtree",
    title: "Managing Director, Alcom Fabrications",
    image: "/testimonials/gary-crabtree.jpg",
    text: "Organising of finance has never been so painless since using Larry and his team. The wealth of knowledge, professionalism, and friendly approach combined with the results they achieve - I wouldn't bother going anywhere else!",
    rating: 5,
  },
  {
    name: "Conrad Crisafulli",
    title: "Venture Capitalist & Property Investor",
    image: "/testimonials/conrad-crisafulli.jpg",
    text: "He just made it all so easy and got me a far better deal than I could ever have imagined. A great team who complement an efficient but relaxed, laid-back and friendly style. Service that's second-to-none.",
    rating: 5,
  },
  {
    name: "Troy Pickard",
    title: "Mayor, City of Joondalup",
    image: "/testimonials/darryl-flaherty.jpg",
    text: "Broad knowledge of the finance market, extensive banking networks and tireless work ethic takes the stress out of financing. Always prepared to go above and beyond the call of duty. A first class recommendation!",
    rating: 5,
  },
  {
    name: "Darryl Flaherty",
    title: "Managing Director, LJ Hooker Joondalup",
    image: "/testimonials/troy-pickard.jpg",
    text: "For a number of years Charter has organised both personal and company investment and every time achieved the lowest interest rate and quickest approval time - we thoroughly recommend them!",
    rating: 5,
  },
  {
    name: "Michael Harrold",
    title: "Director, Sigma Business Sales",
    image: "/testimonials/michael-harrold.jpg",
    text: "Always ready to offer advice and assistance with financing and best of all follows up and keeps you informed every step of the way!",
    rating: 5,
  },
  {
    name: "Bryn Campbell",
    title: "National Manager, The Investors Club",
    image: "/testimonials/bryn-campbell.jpg",
    text: "It's great working with someone so professional and competent. Whenever we have members that we are having difficulty obtaining finance for, I refer them to do their magic!",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PromoBanner />
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
              <div className="text-center lg:text-left">
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Find the Right Home Loan for You
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl lg:mx-0">
                  Expert mortgage brokers comparing 38+ lenders to find you the best rates. 
                  Free service, fast approvals, and personalised support every step of the way.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link href="/contact">
                      Get a Free Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/calculator">Try Our Calculator</Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="/images/hero-home.jpg"
                    alt="Beautiful Australian home"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-xl bg-card p-4 shadow-lg">
                  <p className="text-2xl font-bold text-primary">$2B+</p>
                  <p className="text-sm text-muted-foreground">Loans Settled</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="border-y border-border bg-card py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Services
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whatever your lending needs, we have the expertise to help you achieve your goals.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <Card key={service.title} className="group relative overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow">
                      <service.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                    <Link
                      href="/services"
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Learn more
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Getting the right loan is simple with Better Loans Australia.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Free Consultation",
                  description: "Share your financial situation and what you're looking to achieve.",
                  image: "/images/step-consultation.jpg",
                },
                {
                  step: "2",
                  title: "We Compare Options",
                  description: "We search 38+ lenders to find the best rates and terms for you.",
                  image: "/images/step-compare.jpg",
                },
                {
                  step: "3",
                  title: "Get Approved",
                  description: "We handle the paperwork and liaise with the lender on your behalf.",
                  image: "/images/step-approval.jpg",
                },
                {
                  step: "4",
                  title: "Settlement",
                  description: "Move into your new home or enjoy your refinanced savings.",
                  image: "/images/step-settlement.jpg",
                },
              ].map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                      <span className="text-3xl font-bold text-primary-foreground">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                What Our Clients Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of Australians who have found their perfect home loan with us.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to Find Your Perfect Loan?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Get a free, no-obligation quote today and see how much you could save.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href="/contact">
                    Get Your Free Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <a
                  href="tel:1300238837"
                  className="text-lg font-semibold text-primary-foreground hover:underline"
                >
                  or call 1300 BETTER
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="border-t border-border py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-foreground">$2B+</p>
                <p className="text-sm text-muted-foreground">Loans Settled</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">1,000+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">4.9/5</p>
                <p className="text-sm text-muted-foreground">Google Rating</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">38+</p>
                <p className="text-sm text-muted-foreground">Lender Partners</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
