import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="Better Loans Australia"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-foreground">Better Loans</span>
        </Link>
      </div>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We've sent you a confirmation link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Thanks for signing up! Please check your email and click the confirmation 
            link to activate your account. Once confirmed, you'll be able to access 
            your loan portal.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/auth/login">Back to login</Link>
            </Button>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Return to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
