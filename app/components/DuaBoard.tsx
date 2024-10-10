'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import PrayerHandsIcon from './icons/PrayerHandsIcon';
import { createClient } from '@supabase/supabase-js';

interface Dua {
  id: number;
  content: string;
  created_at: string;
  duacount: number;
  related_ayah: string;
  ayah_translation: string;
  ayah_reference: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Supabase URL or Anon Key is missing');
}

export default function DuaBoard() {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [newDua, setNewDua] = useState("");
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDuas();
  }, []);

  const fetchDuas = async () => {
    if (!supabase) {
      setError('Supabase client is not initialized. Check your environment variables.');
      return;
    }

    const { data, error } = await supabase
      .from('duas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching duas:', error);
      setError('Failed to fetch duas. Please try again later.');
    } else {
      setDuas(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDua.trim() === "") return;

    try {
      const response = await fetch('/api/google-check-dua', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duaContent: newDua }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.isValid) {
        setMessage("Your dua has been submitted successfully.");
        setNewDua("");
        fetchDuas(); // Refresh the dua list
      } else {
        setMessage("The dua you entered is not appropriate. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting dua:', error);
      setMessage("An error occurred while submitting your dua. Please try again.");
    }
  };

  const handleDuaClick = (dua: Dua) => {
    setSelectedDua(dua);
  };

  const handleDuaCount = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supabase) {
      setError('Supabase client is not initialized. Check your environment variables.');
      return;
    }

    const { data, error } = await supabase
      .from('duas')
      .update({ duacount: duas.find(d => d.id === id)!.duacount + 1 })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating dua count:', error);
      setError('Failed to update dua count. Please try again.');
    } else if (data) {
      setDuas(prevDuas =>
        prevDuas.map(dua =>
          dua.id === id ? { ...dua, duacount: dua.duacount + 1 } : dua
        )
      );
    }
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dua Board</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newDua}
            onChange={(e) => setNewDua(e.target.value)}
            placeholder="Enter your dua request..."
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            required
          />
          <button type="submit" className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Submit Dua
          </button>
        </form>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {duas.map(dua => (
            <div 
              key={dua.id} 
              className="border border-gray-200 rounded-md p-4 relative cursor-pointer hover:bg-gray-50"
              onClick={() => handleDuaClick(dua)}
            >
              <p className="mb-2 line-clamp-3">{dua.content}</p>
              <button
                onClick={(e) => handleDuaCount(dua.id, e)}
                className="absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 bg-green-100 rounded-full"
              >
                <PrayerHandsIcon className="h-4 w-4 text-green-600" />
              </button>
              <span className="absolute top-2 right-2 text-sm text-gray-500">
                {dua.duacount} duas
              </span>
            </div>
          ))}
        </div>
      </main>
      {selectedDua && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Dua Details</h2>
            <p className="mb-2">{selectedDua.content}</p>
            <p className="text-sm text-gray-500 mb-2">Submitted on: {new Date(selectedDua.created_at).toLocaleString()}</p>
            <p className="text-sm text-gray-500 mb-4">Dua count: {selectedDua.duacount}</p>
            <div className="bg-green-50 p-2 rounded-md mb-4">
              <p className="text-sm mb-2" dir="rtl">{selectedDua.related_ayah}</p>
              <p className="text-sm mb-2">{selectedDua.ayah_translation}</p>
              <p className="text-xs text-gray-500">Surah {selectedDua.ayah_reference}</p>
            </div>
            <button
              onClick={() => setSelectedDua(null)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {message && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <p className="text-center mb-4">{message}</p>
            <button
              onClick={() => setMessage(null)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <footer className="bg-green-100 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">© 2024 DuaLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}