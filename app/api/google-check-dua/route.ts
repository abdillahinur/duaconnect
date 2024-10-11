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
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

export async function POST(req: Request) {
  try {
    console.log('API route started');
    const { duaContent } = await req.json();
    console.log('Received dua content:', duaContent);

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error("Google API key is missing");
    }

    if (!duaContent) {
      throw new Error("Dua content is missing");
    }

    console.log('Sending request to Google API');
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
            
            If the dua is appropriate, provide either a related Quranic ayah or a hadith (for Sunni Muslims), whichever is more closely related to the dua.
            Respond in JSON format with these fields:
            1. "isAppropriate": a boolean indicating if the dua is appropriate
            2. "relatedText": if isAppropriate is true, provide either a related Quranic ayah or hadith in Arabic
            3. "textTranslation": if isAppropriate is true, provide an English translation of the ayah or hadith
            4. "textReference": if isAppropriate is true, provide the reference (e.g., "Al-Baqarah: 286" for Quran or "Sahih al-Bukhari 6502" for hadith)
            5. "textType": if isAppropriate is true, specify either "ayah" or "hadith"`
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API returned an error: ${response.statusText}`);
    }

    console.log('Received response from Google API');
    const data = await response.json() as GoogleApiResponse;
    console.log('Google API response:', JSON.stringify(data, null, 2));
    
    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Extracted response text:', responseText);

    // Clean the response text by removing markdown-style code block markers
    const jsonMatch = responseText.match(/\{[\s\S]*?\}/);  // Match the JSON part
    if (!jsonMatch) {
      throw new Error("Unable to extract JSON from API response");
    }

    const jsonString = jsonMatch[0]; // Extract the valid JSON from the response
    const apiResponse = JSON.parse(jsonString);  // Parse the extracted JSON
    console.log('Parsed API response:', apiResponse);

    if (apiResponse.isAppropriate) {
      console.log('Dua is appropriate, inserting into Supabase');
      const { data: insertedDua, error: insertError } = await supabase
        .from('duas')
        .insert([
          {
            content: duaContent,
            related_text: apiResponse.relatedText,
            text_translation: apiResponse.textTranslation,
            text_reference: apiResponse.textReference,
            text_type: apiResponse.textType,
            duacount: 0,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (insertError) {
        throw new Error(`Error inserting dua into Supabase: ${insertError.message}`);
      }

      console.log('Dua inserted successfully:', insertedDua);
      return NextResponse.json({
        isValid: true,
        relatedText: apiResponse.relatedText,
        textTranslation: apiResponse.textTranslation,
        textReference: apiResponse.textReference,
        textType: apiResponse.textType,
        insertedDua: insertedDua[0]
      });
    } else {
      console.log('Dua was deemed inappropriate');
      return NextResponse.json({
        isValid: false,
        message: "The dua was deemed inappropriate."
      });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    let errorMessage = "An unknown error occurred";
    let errorDetails: Record<string, unknown> = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack
      };
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = String(error);
      errorDetails = error as Record<string, unknown>;
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails,
      env: {
        hasGoogleApiKey: !!process.env.GOOGLE_API_KEY,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    }, { status: 500 });
  }
}