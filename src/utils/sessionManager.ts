import { supabase } from "@/lib/supabase"

export async function getSessionAndProfile() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
      return { session: null, profile: null }
    }

    return { session, profile }
  }

  return { session: null, profile: null }
}

