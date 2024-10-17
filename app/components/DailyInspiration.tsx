"use client"

import React, { useState, useEffect } from 'react'
import { ArrowRightIcon, BookOpenIcon, StarIcon, Share2Icon, TwitterIcon, FacebookIcon, LinkedinIcon, MessageCircleIcon } from "lucide-react"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

interface QuranVerse {
  arabic: string;
  english: string;
  surah: string;
  ayah: string;
}

interface InspirationData {
  quranVerse: QuranVerse;
  hadith: string;
}

async function fetchFromGenerativeAI(attempt: number): Promise<InspirationData | null> {
  try {
    const response = await fetch('/api/getdailyinspiration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attempt }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status ${response.status}: ${errorText}`);
      throw new Error(`Failed to fetch from Generative AI: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    if ('error' in data) {
      console.error('API returned an error:', data.error, data.details);
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error in fetchFromGenerativeAI:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

async function getLatestInspiration(): Promise<InspirationData | null> {
  const today = new Date().toISOString().split('T')[0];
  try {
    const { data, error } = await supabase
      .from('daily_inspirations')
      .select('*')
      .eq('date', today)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No data found for today, which is expected.');
        return null;
      }
      console.error('Error fetching latest inspiration:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }

    if (!data) {
      console.log('No data returned, but no error occurred.');
      return null;
    }

    console.log('Successfully fetched data:', JSON.stringify(data, null, 2));

    return {
      quranVerse: {
        arabic: data.quran_arabic,
        english: data.quran_english,
        surah: data.quran_surah,
        ayah: data.quran_ayah
      },
      hadith: data.hadith
    };
  } catch (error) {
    console.error('Unexpected error in getLatestInspiration:', error);
    return null;
  }
}

async function saveInspiration(inspiration: InspirationData): Promise<void> {
  if (!inspiration || !inspiration.quranVerse) {
    console.error('Invalid inspiration data:', inspiration);
    throw new Error('Invalid inspiration data');
  }

  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('daily_inspirations')
    .insert({
      date: today,
      quran_arabic: inspiration.quranVerse.arabic || '',
      quran_english: inspiration.quranVerse.english || '',
      quran_surah: inspiration.quranVerse.surah || '',
      quran_ayah: inspiration.quranVerse.ayah || '',
      hadith: inspiration.hadith || ''
    });

  if (error) {
    console.error('Error saving inspiration:', error);
    throw error;
  }
}

async function isContentUnique(inspiration: InspirationData): Promise<boolean> {
  if (!inspiration || !inspiration.quranVerse || !inspiration.quranVerse.ayah) {
    console.error('Invalid inspiration data:', JSON.stringify(inspiration, null, 2));
    return false;
  }

  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  try {
    const { data, error } = await supabase
      .from('daily_inspirations')
      .select('*')
      .gte('date', tenDaysAgo.toISOString().split('T')[0])
      .or(`quran_ayah.eq.${inspiration.quranVerse.ayah},hadith.eq.${inspiration.hadith}`);

    if (error) {
      console.error('Error checking content uniqueness:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }

    console.log('Content uniqueness check result:', JSON.stringify(data, null, 2));

    return data.length === 0;
  } catch (error) {
    console.error('Unexpected error in isContentUnique:', error);
    return false;
  }
}
export default function DailyInspiration() {
  const [inspiration, setInspiration] = useState<InspirationData>({
    quranVerse: { arabic: '', english: '', surah: '', ayah: '' },
    hadith: ''
  });
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [smsOptIn, setSmsOptIn] = useState(false)
  const [emailOptIn, setEmailOptIn] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  useEffect(() => {
    const loadInspiration = async () => {
      setLoading(true);
      try {
        console.log('Starting to load inspiration...');
        let todaysInspiration = await getLatestInspiration();
    
        if (!todaysInspiration) {
          console.log('No inspiration found for today, generating new content...');
          let newInspiration: InspirationData | null = null;
          let attempts = 0;
          const maxAttempts = 3;
    
          while (!newInspiration && attempts < maxAttempts) {
            try {
              console.log(`Attempt ${attempts + 1} to fetch new inspiration`);
              newInspiration = await fetchFromGenerativeAI(attempts + 1);
              if (newInspiration) {
                console.log('New inspiration fetched:', JSON.stringify(newInspiration, null, 2));
                const isUnique = await isContentUnique(newInspiration);
                if (!isUnique) {
                  console.log('Generated content is not unique, retrying...');
                  newInspiration = null;
                } else {
                  console.log('Generated content is unique');
                }
              } else {
                console.log('Failed to fetch new inspiration');
              }
            } catch (error) {
              console.error(`Error fetching new inspiration (Attempt ${attempts + 1}):`, error);
            }
            attempts++;
          }
    
          if (newInspiration) {
            console.log('Saving new inspiration...');
            try {
              await saveInspiration(newInspiration);
              todaysInspiration = newInspiration;
            } catch (saveError) {
              console.error('Error saving new inspiration:', saveError);
              // If we can't save, we'll still use the generated inspiration for today
              todaysInspiration = newInspiration;
            }
          } else {
            console.error("Failed to generate unique inspiration after multiple attempts");
            todaysInspiration = {
              quranVerse: {
                arabic: 'Default Arabic verse',
                english: 'Default English translation',
                surah: 'Default Surah',
                ayah: 'Default Ayah'
              },
              hadith: 'Default Hadith'
            };
          }
        } else {
          console.log('Inspiration for today found in the database.');
        }
    
        console.log('Setting inspiration:', JSON.stringify(todaysInspiration, null, 2));
        setInspiration(todaysInspiration);
      } catch (error) {
        console.error("Failed to fetch daily inspiration:", error);
        setInspiration({
          quranVerse: { arabic: 'Error', english: 'Failed to load inspiration', surah: '', ayah: '' },
          hadith: 'Please try again later'
        });
      } finally {
        setLoading(false);
      }
    };

    loadInspiration();

    // Set up daily refresh at midnight EST
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      5, // 5 AM UTC = midnight EST
      0, 0, 0
    );
    const msToMidnight = night.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      loadInspiration();
      // Set up recurring daily refresh
      setInterval(loadInspiration, 24 * 60 * 60 * 1000);
    }, msToMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log({ phoneNumber, email, smsOptIn, emailOptIn })
    // Reset form after submission
    setPhoneNumber('')
    setEmail('')
    setSmsOptIn(false)
    setEmailOptIn(false)
  }

  const shareText = `https://dualink.vercel.app/daily-inspiration

Quran Verse:
${inspiration.quranVerse.english}
- Surah ${inspiration.quranVerse.surah}, Ayah ${inspiration.quranVerse.ayah}

Hadith:
${inspiration.hadith}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Inspiration',
          text: shareText,
          url: 'https://dualink.vercel.app/daily-inspiration',
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      setShowShareOptions(!showShareOptions)
    }
  }

  const handleSocialShare = (platform: string) => {
    let url = ''
    const encodedText = encodeURIComponent(shareText)
    const currentUrl = encodeURIComponent('https://dualink.vercel.app/daily-inspiration')

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=Daily Inspiration&summary=${encodedText}`
        break
      case 'sms':
        url = `sms:?body=${encodedText}`
        break
    }

    window.open(url, '_blank')
  }


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
      <div className="container mx-auto px-4 pt-0 pb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Daily Inspiration</h1>
            <p className="text-lg">
              Receive daily Quranic verses and hadith to inspire your day.
            </p>
          </div>
  
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 -mx-20 md:mx-0">
              <div className="bg-white shadow p-4 md:rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <BookOpenIcon className="mr-2 h-6 w-6 text-green-600" />
                  Quranic Verse of the Day
                </h2>
                <p className="text-2xl mb-4 text-right font-arabic" lang="ar" dir="rtl">{inspiration.quranVerse.arabic}</p>
                <p className="text-lg mb-4">{inspiration.quranVerse.english}</p>
                <p className="text-sm text-gray-600">Surah {inspiration.quranVerse.surah}, Ayah {inspiration.quranVerse.ayah}</p>
              </div>
  
              <div className="bg-white shadow p-4  md:rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <StarIcon className="mr-2 h-6 w-6 text-green-600" />
                  Hadith of the Day
                </h2>
                <p className="text-lg">{inspiration.hadith}</p>
              </div>
            </div>
          )}
  
          <div className="mt-8 bg-white shadow p-4 md:rounded-lg -mx-20 md:mx-0">
            <h2 className="text-xl font-semibold mb-4">Receive Daily Inspiration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (with country code)</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="sms-opt-in"
                  type="checkbox"
                  checked={smsOptIn}
                  onChange={(e) => setSmsOptIn(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="sms-opt-in" className="text-sm text-gray-700">Receive daily inspiration via SMS</label>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="email-opt-in"
                  type="checkbox"
                  checked={emailOptIn}
                  onChange={(e) => setEmailOptIn(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="email-opt-in" className="text-sm text-gray-700">Receive daily inspiration via Email</label>
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Subscribe to Daily Inspiration
              </button>
            </form>
          </div>
  
          <div className="mt-8 text-center">
            <button 
              onClick={handleShare}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center"
            >
              Share Today&apos;s Inspiration <Share2Icon className="ml-2 h-5 w-5" />
            </button>
  
            {showShareOptions && (
              <div className="mt-4 flex justify-center space-x-4">
                <button onClick={() => handleSocialShare('twitter')} className="text-blue-400 hover:text-blue-600">
                  <TwitterIcon size={24} />
                </button>
                <button onClick={() => handleSocialShare('facebook')} className="text-blue-600 hover:text-blue-800">
                  <FacebookIcon size={24} />
                </button>
                <button onClick={() => handleSocialShare('linkedin')} className="text-blue-700 hover:text-blue-900">
                  <LinkedinIcon size={24} />
                </button>
                <button onClick={() => handleSocialShare('sms')} className="text-green-600 hover:text-green-800">
                  <MessageCircleIcon size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}