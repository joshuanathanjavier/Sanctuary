'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EnhancedMusicPlayer from '@/components/EnhancedMusicPlayer'
import '@/styles/custom-loading.css'

export default function MusicPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'user') {
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
      setLoading(false)
    }

    checkUser()
  }, [router])

  if (loading) {
    return <div id='wrapper'>
      <div className="spinner">
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
    </div>
    }

  return <EnhancedMusicPlayer />
}

