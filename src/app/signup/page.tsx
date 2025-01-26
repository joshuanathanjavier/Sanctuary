'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!isOtpSent) {
      // First step: Sign up and send OTP
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        setIsOtpSent(true)
        setMessage('OTP sent to your email. Please check your inbox.')
      }
    } else {
      // Second step: Verify OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        setIsVerified(true)
        // Create a profile for the new user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id, role: 'user' })

        if (profileError) {
          setError('Error creating user profile')
        } else {
          setMessage('Your account has been verified successfully!')
          setTimeout(() => {
            router.push('/login?verified=true')
          }, 3000) // Redirect to login page after 3 seconds
        }
      }
    }
  }

  const handleResendOtp = async () => {
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('OTP resent to your email. Please check your inbox.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-logUP bg-cover bg-center bg-no-repeat bg-fixed">
      <header className="absolute top-5">
          <div className="m-auto">
            <Link href="/">
              <Image
              src="/images/text-logo.png"
              alt="Logo"
              width={220}
              height={40}
              className="object-contain"
              objectFit="cover"
             />
            </Link>
          </div>
        </header>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">Create account to start listening now</CardDescription>
        </CardHeader>
        <CardContent>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className='space-y-2'>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isOtpSent}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isOtpSent}
            />
          </div>
          {isOtpSent && (
            <div>
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isVerified}>
            {isOtpSent ? 'Verify OTP' : 'Sign Up'}
            {isVerified && ' - Verified'}
          </Button>
        </form>
        {isOtpSent && !isVerified && (
          <Button onClick={handleResendOtp} variant="outline" className="w-full">
            Resend OTP
          </Button>
        )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-center">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
        </CardFooter>
      </Card>
    </div>
  )
}

