"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { getSessionAndProfile } from "@/utils/sessionManager"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isView, setIsView] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const checkSessionAndReset = async () => {
    const reset = searchParams.get("reset")
    const verified = searchParams.get("verified")

    if (reset === "true") {
      try {
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      } catch (error) {
        console.error("Error signing out:", error)
      }
    }

    if (verified === "true") {
      setVerificationMessage("Your account has been verified. You can now log in.")
    }

    const { session, profile } = await getSessionAndProfile()
    if (session) {
      if (profile?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/player")
      }
    } else {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSessionAndReset()
  }, [pathname, searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) throw new Error("Error fetching user profile")

        // Set a flag in localStorage to indicate a new login
        localStorage.setItem("newLogin", "true")

        // Set the auth cookie
        await supabase.auth.setSession(data.session)

        if (profile.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/player")
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-logUP bg-cover bg-center bg-no-repeat bg-fixed">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="m-auto">
            <Link href="/">
              <Image
                src="/images/text-logo.webp"
                alt="Logo"
                width={220}
                height={40}
                className="object-contain"
                objectFit="cover"
                priority
              />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Log in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {verificationMessage && (
            <Alert variant="success" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{verificationMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isView ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                  onClick={() => setIsView(!isView)}
                >
                  {isView ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-sm text-center">
            Forgot your password?{" "}
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Reset Password
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

