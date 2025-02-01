"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, X, User, LogOut, Settings, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import DASS21Modal from "./DASS21Modal"
import { getTracks } from "@/lib/actions"
import { supabase } from "@/lib/supabase"
import type { Track } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart } from "lucide-react"
import { recommendGenres } from "@/utils/recommendGenre"
import "@/styles/custom-scrollbar.css"
import { getSessionAndProfile } from "@/utils/sessionManager"
import Link from "next/link"

type SeverityLevel = "Normal" | "Mild" | "Moderate" | "Severe" | "Extremely Severe"

const genres = [
  "All",
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

const themes = {
  light: {
    primary: "bg-white",
    secondary: "bg-gray-100",
    text: "text-gray-900",
    background: "bg-gray-50",
    genre: "bg-black",
    pattern: "circles",
  },
  dark: {
    primary: "bg-gray-800",
    secondary: "bg-gray-700",
    text: "text-white",
    background: "bg-gray-900",
    genre: "bg-gray-800",
    pattern: "waves",
  },
  nature: {
    primary: "bg-green-600",
    secondary: "bg-green-200",
    text: "text-gray-900",
    background: "bg-green-50",
    genre: "bg-green-600",
    pattern: "leaves",
  },
  ocean: {
    primary: "bg-blue-500",
    secondary: "bg-blue-100",
    text: "text-gray-900",
    background: "bg-blue-50",
    genre: "bg-blue-500",
    pattern: "bubbles",
  },
  "nature-dark": {
    primary: "bg-green-900",
    secondary: "bg-green-800",
    text: "text-green-100",
    background: "bg-green-950",
    genre: "bg-green-900",
    pattern: "trees",
  },
  "ocean-dark": {
    primary: "bg-blue-900",
    secondary: "bg-blue-800",
    text: "text-blue-100",
    background: "bg-blue-950",
    genre: "bg-blue-900",
    pattern: "waves",
  },
}

const AnimatedBackground = ({ theme }: { theme: keyof typeof themes }) => {
  const patterns = {
    circles: (
      <pattern id="circles-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </pattern>
    ),
    waves: (
      <pattern id="waves-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M0 50 Q 25 25, 50 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </pattern>
    ),
    leaves: (
      <pattern id="leaves-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M20,20 Q30,5 40,20 T60,20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <path d="M60,60 Q70,45 80,60 T100,60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </pattern>
    ),
    bubbles: (
      <pattern id="bubbles-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="25" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <circle cx="75" cy="75" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </pattern>
    ),
    trees: (
      <pattern id="trees-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M50,10 L60,40 L40,40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </pattern>
    ),
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>{patterns[themes[theme].pattern as keyof typeof patterns]}</defs>
        <rect width="200%" height="100%" fill={`url(#${themes[theme].pattern}-pattern)`}>
          <animate attributeName="x" from="0" to="-100%" dur="20s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  )
}

const sortTracksByTitle = (tracks: Track[]) => {
  return [...tracks].sort((a, b) => a.title.localeCompare(b.title))
}

const hasSevenDaysPassed = (lastAnswerDate: string) => {
  const lastDate = new Date(lastAnswerDate)
  const currentDate = new Date()
  const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 7
}

const fetchLikedSongs = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase.from("liked_songs").select("track_id").eq("user_id", userId)

  if (error) {
    console.error("Error fetching liked songs:", error)
    return []
  }

  return data.map((item) => item.track_id)
}

export default function EnhancedMusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [likedSongs, setLikedSongs] = useState<Track[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState(genres[0])
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [contentDensity, setContentDensity] = useState<"compact" | "comfortable">("comfortable")
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>("light")
  const [showDASS21Modal, setShowDASS21Modal] = useState(false)
  const [dassScores, setDassScores] = useState({ depression: 0, anxiety: 0, stress: 0 })
  const [recommendedSongs, setRecommendedSongs] = useState<Track[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoadingLikedSongs, setIsLoadingLikedSongs] = useState(true)
  const [currentTab, setCurrentTab] = useState<"allSongs" | "playlist" | "recommended">("allSongs")
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [detectedMetadata, setDetectedMetadata] = useState<{ title: string; artist: string } | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoadingLikedSongs(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error)
        setIsLoadingLikedSongs(false)
        return
      }

      if (session) {
        const userId = session.user.id
        console.log("User ID:", userId)
        const likedSongIds = await fetchLikedSongs(userId)
        console.log("Liked Song IDs:", likedSongIds)
        const likedTracks = tracks.filter((track) => likedSongIds.includes(track.id))
        setLikedSongs(likedTracks)
      } else {
        console.log("No session found")
      }
      setIsLoadingLikedSongs(false)
    }

    fetchSongs()
  }, [tracks])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTracks = await getTracks()
        setTracks(sortTracksByTitle(fetchedTracks))
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const checkUserAccess = async () => {
      const { session, profile } = await getSessionAndProfile()
      if (!session) {
        router.push("/login")
      } else if (profile?.role === "admin") {
        router.push("/admin")
      }
    }
    checkUserAccess()
  }, [router])

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "No email available")
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && audioRef.current) {
      interval = setInterval(() => {
        setProgress(((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1)) * 100)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        playNextSong()
      }
    }
  }, [currentSong, tracks])

  useEffect(() => {
    if (dassScores.depression > 0 || dassScores.anxiety > 0 || dassScores.stress > 0) {
      recommendSongs()
    }
  }, [dassScores, tracks])

  useEffect(() => {
    const checkAndShowDASS21Modal = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const newLogin = localStorage.getItem("newLogin")
      const lastAnswerDate = localStorage.getItem("lastDASS21AnswerDate")

      if (session && newLogin === "true") {
        setShowDASS21Modal(true)
        localStorage.removeItem("newLogin")
      } else if (lastAnswerDate && hasSevenDaysPassed(lastAnswerDate)) {
        setShowDASS21Modal(true)
      } else {
        loadDassScores()
      }
    }

    checkAndShowDASS21Modal()
  }, [])

  useEffect(() => {
    const savedContentDensity = localStorage.getItem("contentDensity") as "compact" | "comfortable" | null
    const savedTheme = localStorage.getItem("currentTheme") as keyof typeof themes | null

    if (savedContentDensity) {
      setContentDensity(savedContentDensity)
    }
    if (savedTheme && Object.keys(themes).includes(savedTheme)) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const savedScores = localStorage.getItem("dassScores")
    if (savedScores) {
      const scores = JSON.parse(savedScores)
      setDassScores(scores)
      recommendSongs(scores)
    }
  }, [])

  const togglePlay = () => {
    let currentTracks: Track[]
    switch (currentTab) {
      case "playlist":
        currentTracks = filterTracks(likedSongs)
        break
      case "recommended":
        currentTracks = filterTracks(recommendedSongs)
        break
      default:
        currentTracks = filteredTracks
    }

    if (currentSong && !isLoading) {
      if (isPlaying) {
        audioRef.current?.pause()
        setIsAudioPlaying(false)
      } else {
        audioRef.current
          ?.play()
          .then(() => {
            setIsAudioPlaying(true)
          })
          .catch((error) => {
            console.error("Error playing audio:", error)
            setIsAudioPlaying(false)
          })
      }
      setIsPlaying(!isPlaying)
    } else if (currentTracks.length > 0 && !isLoading) {
      playSong(currentTracks[0])
    }
  }

  const playSong = (track: Track) => {
    let currentTracks: Track[]
    switch (currentTab) {
      case "playlist":
        currentTracks = filterTracks(likedSongs)
        break
      case "recommended":
        currentTracks = filterTracks(recommendedSongs)
        break
      default:
        currentTracks = filteredTracks
    }

    if (!currentTracks.some((t) => t.id === track.id)) {
      console.log("Song not in current tab's playlist")
      return
    }

    setCurrentSong(track)
    setIsLoading(true)
    if (audioRef.current) {
      audioRef.current.src = track.audio_url
      audioRef.current.load()
      audioRef.current.oncanplaythrough = () => {
        setIsLoading(false)
        audioRef.current
          ?.play()
          .then(() => {
            setIsAudioPlaying(true)
            setIsPlaying(true)

            // Attempt to detect metadata
            if ("mediaSession" in navigator) {
              navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist,
              })
              setDetectedMetadata({ title: track.title, artist: track.artist })
            } else {
              setDetectedMetadata(null)
            }
          })
          .catch((error) => {
            console.error("Error playing audio:", error)
            setIsAudioPlaying(false)
            setIsPlaying(false)
            setDetectedMetadata(null)
          })
      }
      audioRef.current.onerror = () => {
        setIsLoading(false)
        setIsPlaying(false)
        setIsAudioPlaying(false)
        setShowErrorModal(true)
        setDetectedMetadata(null)
      }
    }
  }

  const playNextSong = () => {
    let currentTracks: Track[]
    switch (currentTab) {
      case "playlist":
        currentTracks = filterTracks(likedSongs)
        break
      case "recommended":
        currentTracks = filterTracks(recommendedSongs)
        break
      default:
        currentTracks = filteredTracks
    }

    if (currentTracks.length > 0) {
      const currentIndex = currentSong ? currentTracks.findIndex((track) => track.id === currentSong.id) : -1
      const nextIndex = (currentIndex + 1) % currentTracks.length
      playSong(currentTracks[nextIndex])
    }
  }

  const playPreviousSong = () => {
    let currentTracks: Track[]
    switch (currentTab) {
      case "playlist":
        currentTracks = filterTracks(likedSongs)
        break
      case "recommended":
        currentTracks = filterTracks(recommendedSongs)
        break
      default:
        currentTracks = filteredTracks
    }

    if (currentTracks.length > 0) {
      const currentIndex = currentSong ? currentTracks.findIndex((track) => track.id === currentSong.id) : 0
      const previousIndex = (currentIndex - 1 + currentTracks.length) % currentTracks.length
      playSong(currentTracks[previousIndex])
    }
  }

  const filterTracks = (tracks: Track[]) => {
    return tracks.filter(
      (track) =>
        (selectedGenre === "All" || track.genre === selectedGenre) &&
        (searchTerm === "" ||
          track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  const filteredTracks = filterTracks(sortTracksByTitle(tracks))

  const formatTime = (seconds: number | undefined) => {
    if (typeof seconds !== "number" || isNaN(seconds)) {
      return "-:--"
    }
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const handleDASS21Submit = (scores: { depression: number; anxiety: number; stress: number }) => {
    setDassScores(scores)
    localStorage.setItem("dassScores", JSON.stringify(scores))
    localStorage.setItem("lastDASS21AnswerDate", new Date().toISOString())
    setShowDASS21Modal(false)
    recommendSongs(scores)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCloseDASS21Modal = () => {
    setShowDASS21Modal(false)
  }

  const loadDassScores = () => {
    const savedScores = localStorage.getItem("dassScores")
    if (savedScores) {
      const scores = JSON.parse(savedScores)
      setDassScores(scores)
      recommendSongs(scores)
    }
  }

  const calculateOverallDASS = () => {
    const depressionPercentage = getPercentage(dassScores.depression, "depression")
    const anxietyPercentage = getPercentage(dassScores.anxiety, "anxiety")
    const stressPercentage = getPercentage(dassScores.stress, "stress")
    return Math.round((depressionPercentage + anxietyPercentage + stressPercentage) / 3)
  }

  const getSeverityLabel = (value: number, type: "depression" | "anxiety" | "stress" | "overall") => {
    if (value === 0) {
      return "Normal"
    }

    const ranges = {
      depression: [
        { max: 9, label: "Normal" },
        { max: 13, label: "Mild" },
        { max: 20, label: "Moderate" },
        { max: 27, label: "Severe" },
        { max: Number.POSITIVE_INFINITY, label: "Extremely Severe" },
      ],
      anxiety: [
        { max: 7, label: "Normal" },
        { max: 9, label: "Mild" },
        { max: 14, label: "Moderate" },
        { max: 19, label: "Severe" },
        { max: Number.POSITIVE_INFINITY, label: "Extremely Severe" },
      ],
      stress: [
        { max: 14, label: "Normal" },
        { max: 18, label: "Mild" },
        { max: 25, label: "Moderate" },
        { max: 33, label: "Severe" },
        { max: Number.POSITIVE_INFINITY, label: "Extremely Severe" },
      ],
      overall: [
        { max: 21, label: "Normal" },
        { max: 31, label: "Mild" },
        { max: 47, label: "Moderate" },
        { max: 63, label: "Severe" },
        { max: Number.POSITIVE_INFINITY, label: "Extremely Severe" },
      ],
    }

    return ranges[type].find((range) => value <= range.max)?.label || "Unknown"
  }

  const recommendSongs = (scores = dassScores) => {
    const depressionSeverity = getSeverityLabel(scores.depression, "depression") as SeverityLevel
    const anxietySeverity = getSeverityLabel(scores.anxiety, "anxiety") as SeverityLevel
    const stressSeverity = getSeverityLabel(scores.stress, "stress") as SeverityLevel

    const recommendedGenres = recommendGenres(depressionSeverity, anxietySeverity, stressSeverity)

    const recommendedTracks: Track[] = []
    const usedTrackIds = new Set<string>()

    for (const genre of recommendedGenres) {
      const genreFilteredTracks = tracks.filter((track) => track.genre === genre && !usedTrackIds.has(track.id))
      const shuffledTracks = genreFilteredTracks.sort(() => 0.5 - Math.random())

      for (const track of shuffledTracks) {
        if (!usedTrackIds.has(track.id)) {
          recommendedTracks.push(track)
          usedTrackIds.add(track.id)
          if (recommendedTracks.length >= 9) break
        }
      }

      if (recommendedTracks.length >= 9) break
    }

    if (recommendedTracks.length < 9) {
      const remainingTracks = tracks.filter((track) => !usedTrackIds.has(track.id))
      const shuffledRemaining = remainingTracks.sort(() => 0.5 - Math.random())
      for (const track of shuffledRemaining) {
        if (recommendedTracks.length >= 9) break
        recommendedTracks.push(track)
        usedTrackIds.add(track.id)
      }
    }

    setRecommendedSongs(recommendedTracks)
  }

  const defaultChartData = [
    { name: "Depression", value: 1, color: "#d3d3d3" },
    { name: "Anxiety", value: 1, color: "#d3d3d3" },
    { name: "Stress", value: 1, color: "#d3d3d3" },
  ]

  const dassChartData =
    dassScores.depression > 0 || dassScores.anxiety > 0 || dassScores.stress > 0
      ? [
          { name: "Depression", value: dassScores.depression, color: "#FF6384" },
          { name: "Anxiety", value: dassScores.anxiety, color: "#36A2EB" },
          { name: "Stress", value: dassScores.stress, color: "#FFCE56" },
        ]
      : defaultChartData

  const getPercentage = (value: number, type: "depression" | "anxiety" | "stress") => {
    const ranges = {
      depression: [
        { max: 9, percentage: 20 },
        { max: 13, percentage: 40 },
        { max: 20, percentage: 60 },
        { max: 27, percentage: 80 },
        { max: 42, percentage: 100 },
      ],
      anxiety: [
        { max: 7, percentage: 20 },
        { max: 9, percentage: 40 },
        { max: 14, percentage: 60 },
        { max: 19, percentage: 80 },
        { max: 42, percentage: 100 },
      ],
      stress: [
        { max: 14, percentage: 20 },
        { max: 18, percentage: 40 },
        { max: 25, percentage: 60 },
        { max: 33, percentage: 80 },
        { max: 42, percentage: 100 },
      ],
    }

    const typeRanges = ranges[type]
    for (let i = 0; i < typeRanges.length; i++) {
      if (value <= typeRanges[i].max) {
        if (i === 0) {
          return Math.round((value / typeRanges[i].max) * typeRanges[i].percentage)
        } else {
          const prevMax = typeRanges[i - 1].max
          const prevPercentage = typeRanges[i - 1].percentage
          const rangeSize = typeRanges[i].max - prevMax
          const valueInRange = value - prevMax
          const percentageInRange = typeRanges[i].percentage - prevPercentage
          return Math.round(prevPercentage + (valueInRange / rangeSize) * percentageInRange)
        }
      }
    }
    return 100
  }

  const handleContentDensityChange = (value: "compact" | "comfortable") => {
    setContentDensity(value)
    localStorage.setItem("contentDensity", value)
  }

  const handleThemeChange = (value: keyof typeof themes) => {
    setCurrentTheme(value)
    localStorage.setItem("currentTheme", value)
  }

  const toggleLike = async (track: Track) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const isLiked = likedSongs.some((likedSong) => likedSong.id === track.id)
    let updatedLikedSongs

    if (isLiked) {
      updatedLikedSongs = likedSongs.filter((likedSong) => likedSong.id !== track.id)
      await supabase.from("liked_songs").delete().match({ user_id: user.id, track_id: track.id })
    } else {
      updatedLikedSongs = [...likedSongs, track]
      await supabase.from("liked_songs").insert({ user_id: user.id, track_id: track.id })
    }

    setLikedSongs(updatedLikedSongs)
  }

  const theme = themes[currentTheme]

  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => {
        setIsAudioPlaying(false)
        playNextSong()
      }
      audioRef.current.addEventListener("ended", handleEnded)
      return () => {
        audioRef.current?.removeEventListener("ended", handleEnded)
      }
    }
  }, [currentSong])

  return (
    <div className={`h-screen flex flex-col ${theme.background} ${theme.text} relative overflow-hidden`}>
      <AnimatedBackground theme={currentTheme} />
      <div className="flex flex-col h-full relative z-10">
        <div
          className={`flex justify-between items-center p-4 md:p-6 ${theme.primary} shadow-md ${
            contentDensity === "compact" ? "py-2 md:py-3" : "py-4 md:py-6"
          }`}
        >
          <div className="m-auto">
            <Link href="/">
              <Image
                src="/images/logo-with-text-logo.webp"
                alt="Logo"
                width={150}
                height={40}
                style={{ objectFit: "cover", width: 150, height: 40 }}
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className={`${theme.secondary}`}>
                  <BarChart className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className={`${theme.background} ${theme.text} w-[90vw] max-w-2xl`}>
                <DialogHeader>
                  <DialogTitle>Mental Health Tracker</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {dassChartData.map((entry) => (
                    <div key={entry.name} className="flex justify-between items-center">
                      <span style={{ color: entry.color }}>{entry.name}:</span>
                      <span style={{ color: entry.color }}>
                        {getPercentage(entry.value, entry.name.toLowerCase() as "depression" | "anxiety" | "stress")}%
                      </span>
                    </div>
                  ))}
                  <div className="relative h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dassChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dassChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {dassChartData.map((entry) => (
                      <div key={entry.name} className="flex justify-between items-center">
                        <span>{entry.name}:</span>
                        <span>
                          {getSeverityLabel(
                            entry.value,
                            entry.name.toLowerCase() as "depression" | "anxiety" | "stress",
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Overall Severity:</span>
                    <span>{getSeverityLabel(calculateOverallDASS(), "overall")}</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className={`${theme.secondary}`}>
                  {profilePicture ? (
                    <Image
                      src={profilePicture || "/placeholder.svg"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`${theme.background} ${theme.text}`}>
                <DropdownMenuItem>
                  <Button variant="ghost" onClick={() => setShowDASS21Modal(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Retake Mood Checker</span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => document.getElementById("profile-dialog-trigger")?.click()}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => document.getElementById("settings-dialog-trigger")?.click()}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger asChild>
                <button id="profile-dialog-trigger" className="hidden">
                  Profile
                </button>
              </DialogTrigger>
              <DialogContent className={`${theme.background} ${theme.text} w-[90vw] max-w-2xl`}>
                <DialogHeader>
                  <DialogTitle>Profile</DialogTitle>
                </DialogHeader>
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {profilePicture ? (
                        <Image
                          src={profilePicture || "/placeholder.svg"}
                          alt="Profile"
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      ) : (
                        <div className={`w-16 h-16 ${theme.secondary} rounded-full flex items-center justify-center`}>
                          <User className="h-8 w-8" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">Email:</p>
                        <p className="overflow-hidden">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button id="settings-dialog-trigger" className="hidden">
                  Settings{" "}
                </button>
              </DialogTrigger>
              <DialogContent className={`${theme.background} ${theme.text} w-[90vw] max-w-2xl`}>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="content-density" className="block text-sm font-medium mb-1">
                      Layout
                    </label>
                    <Select value={contentDensity} onValueChange={handleContentDensityChange}>
                      <SelectTrigger id="content-density" className={`${theme.primary} ${theme.text}`}>
                        <SelectValue placeholder="Select density" />
                      </SelectTrigger>
                      <SelectContent className={`${theme.primary} ${theme.text}`}>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>{" "}
                      </SelectContent>
                    </Select>{" "}
                  </div>
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium mb-1">
                      Theme
                    </label>
                    <Select value={currentTheme} onValueChange={handleThemeChange}>
                      <SelectTrigger id="theme" className={`${theme.primary} ${theme.text}`}>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className={`${theme.primary} ${theme.text}`}>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="ocean">Ocean</SelectItem>
                        <SelectItem value="nature-dark">Nature - Dark</SelectItem>
                        <SelectItem value="ocean-dark">Ocean - Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>{/*Rest of the settings here*/}</div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${theme.primary} p-4`}>
            <Button variant="ghost" onClick={() => setShowDASS21Modal(true)} className="w-full justify-start mb-2">
              <Edit className="mr-2 h-4 w-4" />
              <span>Retake Mood Checker</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => document.getElementById("profile-dialog-trigger")?.click()}
              className="w-full justify-start mb-2"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => document.getElementById("settings-dialog-trigger")?.click()}
              className="w-full justify-start mb-2"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        )}
        <div
          className={`flex-1 overflow-hidden flex flex-col ${
            contentDensity === "compact" ? "p-2 md:p-4" : "p-4 md:p-8"
          }`}
          style={{ paddingBottom: contentDensity === "compact" ? "100px" : "120px" }}
        >
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className={`mb-4 ${contentDensity === "compact" ? "space-y-2" : "space-y-4"}`}>
              <div className="flex flex-row gap-2 mb-4 w-full">
                <Input
                  type="search"
                  placeholder="Search songs or artists"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`flex-1 ${theme.background} ${theme.text} placeholder-opacity-70`}
                />
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="secondary"
                  size="icon"
                  className={`${theme.secondary}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className={`flex flex-wrap ${contentDensity === "compact" ? "gap-1" : "gap-2"}`}>
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    variant={selectedGenre === genre ? "default" : "secondary"}
                    className={`${selectedGenre === genre ? theme.genre : theme.secondary} text-xs md:text-sm`}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            <Tabs
              defaultValue="allSongs"
              className="w-full flex-1 flex flex-col overflow-hidden"
              onValueChange={(value) => setCurrentTab(value as "allSongs" | "playlist" | "recommended")}
            >
              <TabsList className={`grid w-full grid-cols-3 mb-4 ${theme.secondary} ${theme.text}`}>
                <TabsTrigger value="allSongs" className={`data-[state=active]:${theme.primary}`}>
                  All Songs
                </TabsTrigger>
                <TabsTrigger value="playlist" className={`data-[state=active]:${theme.primary}`}>
                  Liked Songs
                </TabsTrigger>
                <TabsTrigger value="recommended" className={`data-[state=active]:${theme.primary}`}>
                  Recommended
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-hidden">
                <TabsContent value="allSongs" className="h-full overflow-y-auto custom-scrollbar">
                  <div className="pb-20">
                    {filteredTracks.map((track) => (
                      <div
                        key={track.id}
                        className={`flex items-center justify-between rounded-md hover:${theme.secondary} transition-colors ${
                          contentDensity === "compact" ? "p-1" : "p-2"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => playSong(track)}
                            className={theme.secondary}
                          >
                            {currentSong?.id === track.id && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <p
                              className={`font-medium ${contentDensity === "compact" ? "text-xs md:text-sm" : "text-sm md:text-base"}`}
                            >
                              {track.title}
                            </p>
                            <p
                              className={`opacity-70 ${contentDensity === "compact" ? "text-xs" : "text-xs md:text-sm"}`}
                            >
                              {track.artist}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleLike(track)}
                          className={`${theme.secondary} ${
                            likedSongs.some((likedSong) => likedSong.id === track.id) ? "text-red-500" : ""
                          }`}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="playlist" className="h-full overflow-y-auto custom-scrollbar">
                  <div className="pb-20">
                    {isLoadingLikedSongs ? (
                      <p className="text-center">Loading liked songs...</p>
                    ) : filterTracks(likedSongs).length > 0 ? (
                      filterTracks(likedSongs).map((track) => (
                        <div
                          key={track.id}
                          className={`flex items-center justify-between rounded-md hover:${theme.secondary} transition-colors ${
                            contentDensity === "compact" ? "p-1" : "p-2"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => playSong(track)}
                              className={theme.secondary}
                            >
                              {currentSong?.id === track.id && isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <div>
                              <p
                                className={`font-medium ${contentDensity === "compact" ? "text-xs md:text-sm" : "text-sm md:text-base"}`}
                              >
                                {track.title}
                              </p>
                              <p
                                className={`opacity-70 ${contentDensity === "compact" ? "text-xs" : "text-xs md:text-sm"}`}
                              >
                                {track.artist}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleLike(track)}
                            className={`${theme.secondary} text-red-500`}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center">No liked songs found matching the current filters.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="recommended" className="h-full overflow-y-auto custom-scrollbar">
                  <div className="pb-10">
                    {filterTracks(recommendedSongs).length > 0 ? (
                      filterTracks(recommendedSongs).map((track) => (
                        <div
                          key={track.id}
                          className={`flex items-center justify-between rounded-md hover:${theme.secondary} transition-colors ${
                            contentDensity === "compact" ? "p-1" : "p-2"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => playSong(track)}
                              className={theme.secondary}
                            >
                              {currentSong?.id === track.id && isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <div>
                              <p
                                className={`font-medium ${contentDensity === "compact" ? "text-xs md:text-sm" : "text-sm md:text-base"}`}
                              >
                                {track.title}
                              </p>
                              <p
                                className={`opacity-70 ${contentDensity === "compact" ? "text-xs" : "text-xs md:text-sm"}`}
                              >
                                {track.artist}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleLike(track)}
                            className={`${theme.secondary} ${
                              likedSongs.some((likedSong) => likedSong.id === track.id) ? "text-red-500" : ""
                            }`}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center">
                        {recommendedSongs.length === 0
                          ? "No recommendations available. Please complete the Mood Checker."
                          : "No recommended songs found matching the current filters."}
                      </p>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        <div
          className={`fixed bottom-0 left-0 right-0 ${theme.primary} shadow-md ${
            contentDensity === "compact" ? "p-1 md:p-2" : "p-2 md:p-4"
          }`}
        >
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <div className="flex-1 w-full md:w-auto">
              {currentSong && (
                <div className="flex items-center justify-center md:justify-start">
                  <div className="text-center md:text-left">
                    <p
                      className={`font-medium ${contentDensity === "compact" ? "text-xs md:text-sm" : "text-sm md:text-base"}`}
                    >
                      {detectedMetadata ? detectedMetadata.title : currentSong.title}
                    </p>
                    <p className={`opacity-70 ${contentDensity === "compact" ? "text-xs" : "text-xs md:text-sm"}`}>
                      {detectedMetadata ? detectedMetadata.artist : currentSong.artist}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Button variant="ghost" size="icon" onClick={playPreviousSong} className={theme.secondary}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePlay} className={theme.secondary}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNextSong} className={theme.secondary}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs md:text-sm w-10 text-right">{formatTime(audioRef.current?.currentTime)}</span>
              <Slider
                value={[progress]}
                onValueChange={(value) => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = (value[0] / 100) * (audioRef.current.duration || 0)
                    setProgress(value[0])
                  }
                }}
                max={100}
                step={1}
                className={`w-full ${theme.secondary}`}
              />
              <span className="text-xs md:text-sm w-10">{formatTime(audioRef.current?.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={[volume * 100]}
                onValueChange={(value) => setVolume(value[0] / 100)}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>

      <DASS21Modal
        isOpen={showDASS21Modal}
        onCloseAction={handleCloseDASS21Modal}
        onSubmitAction={handleDASS21Submit}
        isReminder={!!localStorage.getItem("lastDASS21AnswerDate")}
      />
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className={`${theme.background} ${theme.text}`}>
          <DialogHeader>
            <DialogTitle>Error Playing Track</DialogTitle>
          </DialogHeader>
          <p>The track failed to load. This may be due to slow internet or an issue with the server.</p>
          <DialogFooter>
            <Button onClick={() => setShowErrorModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

