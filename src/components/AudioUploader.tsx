"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadDropzone } from "@/utils/uploadthing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addTrack } from "@/lib/actions"
import { Upload } from "lucide-react"

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
  const router = useRouter()

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
      router.refresh()
    } catch (error) {
      console.error("Failed to add track:", error)
      alert("Failed to add track. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
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
          <Button type="submit" disabled={!uploadedFileUrl || !title || !artist || !genre} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Add Track
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

