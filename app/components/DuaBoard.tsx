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
  related_text: string;
  text_translation: string;
  text_reference: string;
  text_type: 'ayah' | 'hadith';
}

interface ErrorResponse {
  error: string;
  details?: Record<string, unknown>;
  env?: {
    hasGoogleApiKey: boolean;
    hasSupabaseUrl: boolean;
    hasSupabaseKey: boolean;
  };
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DuaBoard() {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [newDua, setNewDua] = useState("");
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState<ErrorResponse | null>(null);
  const [successfulDua, setSuccessfulDua] = useState<Dua | null>(null);

  useEffect(() => {
    fetchDuas();
  }, []);

  const fetchDuas = async () => {
    const { data, error } = await supabase
      .from('duas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching duas:', error);
    } else {
      setDuas(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDua.trim() === "") return;

    setIsSubmitting(true);
    setSubmitMessage('');
    setErrorDetails(null);

    try {
      const response = await fetch('/api/google-check-dua', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duaContent: newDua }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.isValid) {
          const newDuaData = data.insertedDua;
          setDuas(prevDuas => [newDuaData, ...prevDuas]);
          setNewDua("");
          setSubmitMessage("Your dua has been submitted successfully.");
          setSuccessfulDua(newDuaData);
        } else {
          setSubmitMessage("The dua you entered is not appropriate. Please try again.");
        }
      } else {
        setErrorDetails(data as ErrorResponse);
      }
    } catch (error) {
      console.error('Error submitting dua:', error);
      setErrorDetails({
        error: 'An unexpected error occurred while submitting your dua.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuaClick = (dua: Dua) => {
    setSelectedDua(dua);
  };

  const handleDuaCount = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const { data, error } = await supabase
      .from('duas')
      .update({ duacount: duas.find(d => d.id === id)!.duacount + 1 })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating dua count:', error);
    } else if (data) {
      setDuas(prevDuas =>
        prevDuas.map(dua =>
          dua.id === id ? { ...dua, duacount: dua.duacount + 1 } : dua
        )
      );
    }
  };

  const renderDuaModal = (dua: Dua, onClose: () => void) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">Dua Details</h2>
        <p className="mb-2">{dua.content}</p>
        <p className="text-sm text-gray-500 mb-2">Submitted on: {new Date(dua.created_at).toLocaleString()}</p>
        <p className="text-sm text-gray-500 mb-4">Dua count: {dua.duacount}</p>
        <div className="bg-green-50 p-2 rounded-md mb-4">
          <p className="text-sm mb-2" dir="rtl">{dua.related_text}</p>
          <p className="text-sm mb-2">{dua.text_translation}</p>
          <p className="text-xs text-gray-500">
            {dua.text_type === 'ayah' ? 'Surah ' : 'Hadith: '}
            {dua.text_reference}
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Close
        </button>
      </div>
    </div>
  );

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
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Dua'}
          </button>
        </form>
        {submitMessage && (
          <p className="mb-4 text-green-600 font-medium">{submitMessage}</p>
        )}
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
      {selectedDua && renderDuaModal(selectedDua, () => setSelectedDua(null))}
      {successfulDua && renderDuaModal(successfulDua, () => setSuccessfulDua(null))}
      {errorDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p className="text-red-600 mb-4">{errorDetails.error}</p>
            {errorDetails.details && (
              <div className="mb-4">
                <h4 className="font-semibold">Details:</h4>
                <pre className="text-sm overflow-auto max-h-40">
                  {JSON.stringify(errorDetails.details, null, 2)}
                </pre>
              </div>
            )}
            {errorDetails.env && (
              <div className="mb-4">
                <h4 className="font-semibold">Environment:</h4>
                <ul className="list-disc list-inside">
                  <li>Google API Key: {errorDetails.env.hasGoogleApiKey ? 'Set' : 'Missing'}</li>
                  <li>Supabase URL: {errorDetails.env.hasSupabaseUrl ? 'Set' : 'Missing'}</li>
                  <li>Supabase Key: {errorDetails.env.hasSupabaseKey ? 'Set' : 'Missing'}</li>
                </ul>
              </div>
            )}
            <button
              onClick={() => setErrorDetails(null)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Close
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