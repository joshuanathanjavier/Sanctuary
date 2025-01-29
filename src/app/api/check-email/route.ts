import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Initialize Supabase client with admin privileges
    const supabase = createRouteHandlerClient({
      cookies,
    })

    // Use RPC to query auth.users schema
    const { data, error } = await supabase.rpc("check_if_email_exists", {
      email_to_check: email,
    })

    if (error) {
      console.error("Error checking email:", error)
      return NextResponse.json({ error: "An error occurred while checking the email." }, { status: 500 })
    }

    return NextResponse.json({ exists: data })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 })
  }
}

