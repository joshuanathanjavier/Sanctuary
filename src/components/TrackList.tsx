"use client"

import { useEffect, useState, useTransition, useOptimistic } from "react"
import { getTracks, deleteTrack } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Track } from "@/types"

export function TrackList() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isPending, startTransition] = useTransition()
  const [optimisticTracks, addOptimisticTrack] = useOptimistic(tracks, (state, deletedId: string) =>
    state.filter((track) => track.id !== deletedId),
  )
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchTracks = async () => {
      const fetchedTracks = await getTracks()
      setTracks(fetchedTracks)
    }
    fetchTracks()
  }, [])

  const handleDelete = (id: string) => {
    startTransition(() => {
      addOptimisticTrack(id)
    })
    startTransition(async () => {
      const formData = new FormData()
      formData.append("id", id)
      await deleteTrack(formData)
      const updatedTracks = await getTracks()
      setTracks(updatedTracks)
    })
  }

  const filteredTracks = optimisticTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="w-full max-w-[95vw] mx-auto sm:max-w-none">
      <CardHeader>
        <CardTitle>Sound Tracks</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader className="hidden sm:table-header-group">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Artist</TableHead>
                <TableHead className="hidden md:table-cell">Genre</TableHead>
                <TableHead className="hidden md:table-cell">Uploaded At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {filteredTracks.map((track) => (
                <TableRow key={track.id} className="flex flex-col sm:table-row">
                  <TableCell className="font-medium py-2 sm:py-4">
                    {track.title}
                    <div className="sm:hidden text-sm text-gray-500">
                      {track.artist} • {track.genre} • {new Date(track.created_at).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{track.artist}</TableCell>
                  <TableCell className="hidden md:table-cell">{track.genre}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(track.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right py-2 sm:py-4">
                    <Button
                      onClick={() => handleDelete(track.id.toString())}
                      variant="destructive"
                      disabled={isPending}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>{isPending ? "Deleting..." : "Delete"}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

