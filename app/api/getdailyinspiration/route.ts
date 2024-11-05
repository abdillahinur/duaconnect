import { NextRequest, NextResponse } from 'next/server';

interface GeneratedContent {
  quranicVerse: {
    arabic: string;
    english: string;
    surah: string;
    ayah: string;
  };
  hadith: {
    title: string;
    text: string;
    source: string;
    number: string;
  };
}

export async function GET() {
  return handleRequest();
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req?: NextRequest) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error('GOOGLE_API_KEY is not set in environment variables');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    let attempt = 1;
    if (req) {
      const body = await req.json();
      attempt = body.attempt || 1;
    }

    const prompt = `You are a knowledgeable Islamic scholar tasked with providing daily spiritual inspiration. Generate a unique combination of a Quranic verse and a Hadith that hasn't been used in recent days.

Requirements for the Quranic verse:
1. Choose a verse with clear, universal wisdom or guidance
2. Provide both Arabic text and English translation
3. Include the exact Surah name and Ayah number
4. Ensure the translation is accurate and from a reputable source

Requirements for the Hadith:
1. Choose a well-authenticated (Sahih) Hadith from either Sahih Bukhari or Sahih Muslim
2. Begin the hadith with "The Prophet Muhammad (ﷺ) said:" when appropriate
3. Include the complete source and specific hadith number at the end in parentheses
4. Keep the hadith concise but complete
5. Format example: "The Prophet Muhammad (ﷺ) said: "[hadith text]" (Sahih Bukhari 1234)"

This is attempt number ${attempt}. Please ensure the content is different from previous attempts.

Format the response as a JSON object with the following structure:
{
  "quranicVerse": {
    "arabic": "Arabic text",
    "english": "English translation",
    "surah": "Surah name",
    "ayah": "Ayah number"
  },
  "hadith": "The complete hadith text with attribution and source"
}

Important: Do not include any markdown formatting in the response. Ensure all text is properly escaped for JSON.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Generative AI API error:', response.status, errorText);
      throw new Error(`Failed to fetch from Generative AI: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected response structure from Generative AI:', JSON.stringify(data));
      throw new Error('Unexpected response structure from Generative AI');
    }
// In your route.ts, update the return statement:
let generatedContent: GeneratedContent;
try {
  const cleanedText = data.candidates[0].content.parts[0].text.replace(/```json\n|\n```/g, '');
  generatedContent = JSON.parse(cleanedText);

  // Add validation and formatting for hadith
  if (!generatedContent.hadith || typeof generatedContent.hadith === 'object') {
    console.error('Invalid hadith format received:', generatedContent.hadith);
    throw new Error('Invalid hadith format');
  }

  const today = new Date().toISOString().split('T')[0];

  return NextResponse.json({
    date: today,
    quranVerse: {
      arabic: generatedContent.quranicVerse.arabic,
      english: generatedContent.quranicVerse.english,
      surah: generatedContent.quranicVerse.surah,
      ayah: generatedContent.quranicVerse.ayah,
    },
    hadith: generatedContent.hadith // Ensure this is a string
  });
} catch (parseError) {
  console.error('Error parsing generated content:', parseError);
  console.error('Raw content:', data.candidates[0].content.parts[0].text);
  throw new Error('Failed to parse generated content');
}

    if (!generatedContent.quranicVerse || !generatedContent.hadith) {
      console.error('Generated content is missing required fields:', JSON.stringify(generatedContent));
      throw new Error('Generated content is missing required fields');
    }

    const today = new Date().toISOString().split('T')[0];

    return NextResponse.json({
      date: today,
      quranVerse: {
        arabic: generatedContent.quranicVerse.arabic,
        english: generatedContent.quranicVerse.english,
        surah: generatedContent.quranicVerse.surah,
        ayah: generatedContent.quranicVerse.ayah,
      },
      hadith: {
        title: generatedContent.hadith.title,
        text: generatedContent.hadith.text,
        source: generatedContent.hadith.source,
        number: generatedContent.hadith.number
      }
    });
  } catch (error) {
    console.error('Error in API function:', error);
    return NextResponse.json({ 
      error: 'Failed to generate inspiration', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}