import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Award, Users, Target, Heart, ArrowRight } from "lucide-react"

const team = [
  {
    name: "Larry Hirsch",
    role: "Managing Director",
    image: "/team/larry-hirsch.jpg",
    bio: "Larry is both an Australian and South African Chartered Accountant with an extensive career spanning finance, venture capital, and structured finance. His experience includes Manager of KPMG's Johannesburg tax office, group tax adviser to the Standard Bank Group of South Africa, and Director of Standard Bank Development Finance. Larry has a wealth of experience in contract negotiation, small business development, and structured finance. He is MFAA accredited and has been ranked in the MPA Magazine top 100 brokers.",
  },
  {
    name: "Heidi Gusterson",
    role: "Mortgage Specialist",
    image: "/team/heidi-gusterson.jpg",
    bio: "Heidi has a wealth of experience in banking and loan writing. She worked with Westpac for 9 years and has been in the mortgage broking world since. Heidi holds a Certificate IV Financial Services and a Bachelor degree from Curtin University. She takes pride in her attention to detail and delights in assisting clients make their financial dreams come true. She has worked with Larry at Charter Finance since 2012.",
  },
]

const values = [
  {
    icon: Heart,
    title: "Client First",
    description: "Your goals are our priority. We work for you, not the banks.",
  },
  {
    icon: Target,
    title: "Lowest Rate, No Cost",
    description: "We compare 38+ lenders to get you the best rate at no cost to you.",
  },
  {
    icon: Users,
    title: "Flexible Support",
    description: "Available to discuss your options and support you through your decision.",
  },
  {
    icon: Award,
    title: "Award-Winning",
    description: "Ranked in MPA Magazine top 100 brokers and MFAA accredited.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                About Us
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Let us find the best finance to suit your needs! We always strive to bring to our 
                clients the most suitable and optimum loan finance at the lowest possible rate &mdash; 
                and in respect of home loans &mdash; all at no cost to you.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Award className="mr-2 h-4 w-4" />
                  MPA Top 100 Brokers
                </span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  MFAA Accredited
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Our Story
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <p>
                    We are proudly affiliated with Charter Mortgage and Finance Pty Ltd, Perth&apos;s 
                    trusted home and investment loan specialists. With over 18 years of experience 
                    in the Australian finance industry, we have built a reputation for excellence, 
                    integrity, and personalised service.
                  </p>
                  <p>
                    Our approach is different. We take the time to understand your unique 
                    situation, goals, and concerns. With access to over 38 lenders, each with 
                    their own selection of products, we navigate the competitive loan market 
                    to ensure we always get the best rate for our clients.
                  </p>
                  <p>
                    Over the years, we have settled thousands of loans and underwritten over 
                    $2 billion in finance. We specialise in owner-occupied residential property, 
                    commercial and residential investment, NDIS and HMO investment, and 
                    self-managed superfunds.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/images/about-office.jpg"
                    alt="Our office"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-4xl font-bold">18+</p>
                        <p className="text-sm">Years of Excellence</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold">$2B+</p>
                        <p className="text-sm">Loans Settled</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Values
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                What sets us apart from other mortgage brokers.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Meet Our Team
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Experienced professionals dedicated to your success.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {team.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-sm font-medium text-primary">{member.role}</p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Let us help you find the perfect loan for your needs.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">
                    Contact Us Today
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
