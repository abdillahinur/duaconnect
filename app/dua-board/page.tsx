'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL')
}
if (!supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

let supabase: any = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export default function DuaBoard() {
  const [duas, setDuas] = useState([])

  useEffect(() => {
    async function fetchDuas() {
      if (!supabase) {
        console.error('Supabase client not initialized')
        return
      }

      const { data, error } = await supabase
        .from('duas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching duas:', error)
      } else {
        setDuas(data)
      }
    }

    fetchDuas()
  }, [])

  if (!supabase) {
    return <div>Error: Supabase client not initialized. Check your environment variables.</div>
  }

  // Render your dua board here using the 'duas' state
  return (
    <div>
      {/* Your dua board JSX */}
      {duas.map((dua: any) => (
        <div key={dua.id}>{/* Render each dua */}</div>
      ))}
    </div>
  )
}