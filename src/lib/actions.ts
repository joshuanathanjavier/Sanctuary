'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from './db'
import { utapi } from '@/app/api/uploadthing/core'
import { Track } from '@/types'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function addTrack(track: Omit<Track, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('tracks')
    .insert([
      { 
        title: track.title, 
        artist: track.artist, 
        genre: track.genre, 
        audio_url: track.audio_url 
      }
    ])
    .select()

  if (error) {
    console.error('Error adding track:', error)
    throw new Error('Failed to add track')
  }

  revalidatePath('/tracks')
  return data[0]
}

export async function deleteTrack(formData: FormData) {
  const id = formData.get('id') as string
  
  const { data: track, error: fetchError } = await supabase
    .from('tracks')
    .select('audio_url')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Error fetching track:', fetchError)
    throw new Error('Failed to fetch track')
  }

  if (track) {
    try {
      // Extract the key from the audio_url
      const key = track.audio_url.split('/').pop()
      await utapi.deleteFiles(key)
      console.log(`File deleted from Uploadthing: ${key}`)
    } catch (error) {
      console.error(`Failed to delete file from Uploadthing: ${error}`)
    }

    const { error: deleteError } = await supabase
      .from('tracks')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting track:', deleteError)
      throw new Error('Failed to delete track')
    }
    
    revalidatePath('/tracks')
  } else {
    console.error(`Track not found: ${id}`)
  }
}

export async function getTracks() {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tracks:', error)
    throw new Error('Failed to fetch tracks')
  }

  return data
}

export async function logout() {
  (await cookies()).delete('session')
  redirect('/login')
}

