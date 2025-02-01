import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Fetch total profiles (users)
    const { count: totalProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      throw profilesError
    }

    // Fetch total tracks
    const { count: totalTracks, error: tracksError } = await supabase
      .from("tracks")
      .select("*", { count: "exact", head: true })

    if (tracksError) {
      console.error("Error fetching tracks:", tracksError)
      throw tracksError
    }

    console.log("Fetched totals:", { totalProfiles, totalTracks })

    // Return the data
    return NextResponse.json({ totalUsers: totalProfiles || 0, totalSongs: totalTracks || 0 })
  } catch (error) {
    console.error("Error in /api/totals:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 })
  }
}

