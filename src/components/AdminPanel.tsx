"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AudioUploader } from "@/components/AudioUploader"
import { TrackList } from "@/components/TrackList"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase"
import { LogOut, Upload, List } from "lucide-react"
import { getSessionAndProfile } from "@/utils/sessionManager"

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"upload" | "list">("upload")
  const router = useRouter()

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { session, profile } = await getSessionAndProfile()
      if (!session || profile?.role !== "admin") {
        router.push("/login")
      }
    }
    checkAdminAccess()
  }, [router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      // Optionally, show an error message to the user
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar className="hidden md:flex">
          <SidebarHeader>
            <h1 className="text-xl font-bold p-4">Sanctuary Admin</h1>
          </SidebarHeader>
          <SidebarContent>
            <div className="space-y-2 p-4">
              <Button
                variant={activeTab === "upload" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Music
              </Button>
              <Button
                variant={activeTab === "list" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("list")}
              >
                <List className="mr-2 h-4 w-4" />
                Music List
              </Button>
            </div>
          </SidebarContent>
          <div className="mt-auto p-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </Sidebar>
        <SidebarInset className="w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="md:hidden" />
            <h2 className="text-2xl font-semibold">{activeTab === "upload" ? "Upload Music File" : "Music List"}</h2>
          </header>
          <main className="flex-1 overflow-auto p-6">{activeTab === "upload" ? <AudioUploader /> : <TrackList />}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

