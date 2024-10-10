import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface GoogleApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '[EXISTS]' : '[MISSING]');
  try {
    const { duaContent } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error("Google API key is missing");
    }

    if (!duaContent) {
      throw new Error("Dua content is missing");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Evaluate if the following dua request is appropriate: "${duaContent}". 
            It should be considered inappropriate if it:
            1. Revolves around haram (forbidden in Islam) topics
            2. Asks for a boyfriend or girlfriend
            3. Contains any other inappropriate content
            
            If the dua is appropriate, provide a related Quranic ayah.
            Respond in JSON format with these fields:
            1. "isAppropriate": a boolean indicating if the dua is appropriate
            2. "relatedAyah": if isAppropriate is true, provide a related Quranic ayah in Arabic
            3. "ayahTranslation": if isAppropriate is true, provide an English translation of the ayah
            4. "ayahReference": if isAppropriate is true, provide the Surah name and ayah number (e.g., "Al-Baqarah: 286")`
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API returned an error: ${response.statusText}`);
    }

    const data = await response.json() as GoogleApiResponse;
    const responseText = data.candidates[0].content.parts[0].text;
    const apiResponse = JSON.parse(responseText);

    if (apiResponse.isAppropriate) {
      const { error: insertError } = await supabase
        .from('duas')
        .insert([
          {
            content: duaContent,
            related_ayah: apiResponse.relatedAyah,
            ayah_translation: apiResponse.ayahTranslation,
            ayah_reference: apiResponse.ayahReference,
            duacount: 0,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        throw new Error(`Error inserting dua into Supabase: ${insertError.message}`);
      }
    }

    return NextResponse.json({ 
      isValid: apiResponse.isAppropriate,
      relatedAyah: apiResponse.relatedAyah,
      ayahTranslation: apiResponse.ayahTranslation,
      ayahReference: apiResponse.ayahReference
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}