export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  imageUrl?: string;
  genre: string;
}
 
 export type Track = {
    id: string
    title: string
    artist: string
    genre: string
    audio_url: string
    created_at: string
  }
  
  export type Theme = 'light' | 'dark' | 'nature' | 'ocean' | 'nature-dark' | 'ocean-dark';
  
  export interface DASSScores {
    depression: number;
    anxiety: number;
    stress: number;
  }
  
  export interface Users {
    id: string;
    email: string;
    name: string;
    profilePicture?: string;
  }
  
  export interface UserSettings {
    theme: Theme;
    contentDensity: 'compact' | 'comfortable';
  }
  
  