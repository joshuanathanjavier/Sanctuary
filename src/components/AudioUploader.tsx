"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { UploadDropzone } from "@/utils/uploadthing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addTrack } from "@/lib/actions"
import { Upload, Users, Music } from "lucide-react"

const genres = [
  "Ambient",
  "Atmospheric",
  "Dark",
  "Energizing",
  "Instrumental",
  "Lofi",
  "Magnificent",
  "Nature",
  "Sentimental",
]

export function AudioUploader() {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [genre, setGenre] = useState("")
  const [uploadedFileUrl, setUploadedFileUrl] = useState("")
  const [uploadedFileKey, setUploadedFileKey] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalSongs, setTotalSongs] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchTotals = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch("/api/totals")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      console.log("Received totals:", data)
      setTotalUsers(data.totalUsers)
      setTotalSongs(data.totalSongs)
    } catch (error) {
      console.error("Error fetching totals:", error)
      setError("Failed to fetch totals. Please try again later.")
    }
  }, [])

  useEffect(() => {
    fetchTotals()
  }, [fetchTotals])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedFileUrl || !uploadedFileKey || !title || !artist || !genre) return

    try {
      await addTrack({
        title,
        artist,
        genre,
        audio_url: uploadedFileUrl,
      })

      setTitle("")
      setArtist("")
      setGenre("")
      setUploadedFileUrl("")
      setUploadedFileKey("")
      setUploadProgress(0)
      fetchTotals() // Refresh totals after successful upload
      router.refresh()
    } catch (error) {
      console.error("Failed to add track:", error)
      alert("Failed to add track. Please try again.")
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto">
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Upload New Sound</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                <Input id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={genre} onValueChange={setGenre} required>
                <SelectTrigger id="genre">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audio File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <UploadDropzone
                  endpoint="audioUploader"
                  onClientUploadComplete={(res) => {
                    setUploadedFileUrl(res?.[0]?.url || "")
                    setUploadedFileKey(res?.[0]?.key || "")
                    setUploadProgress(100)
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`)
                  }}
                  onUploadProgress={(progress) => {
                    setUploadProgress(progress)
                  }}
                  appearance={{
                    button: "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg",
                    allowedContent: "text-sm text-muted-foreground",
                  }}
                />
                {uploadedFileUrl && <p className="text-sm text-muted-foreground mt-2">File uploaded successfully</p>}
              </div>
              {uploadProgress > 0 && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="w-full h-2" />
                  <p className="text-sm text-center mt-1">
                    {uploadProgress < 100 ? `Uploading: ${uploadProgress}%` : "Upload complete! Add track to save."}
                  </p>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Do not forget to add track to save it.</p>
            <Button type="submit" disabled={!uploadedFileUrl || !title || !artist || !genre} className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Add Track
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Total Users</span>
                </div>
                <span className="font-bold">{totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  <span>Total Songs</span>
                </div>
                <span className="font-bold">{totalSongs}</span>
              </div>
            </div>
          )}
          <Button onClick={fetchTotals} className="mt-4 w-full">
            Refresh Totals
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

