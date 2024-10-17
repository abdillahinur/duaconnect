import { NextRequest, NextResponse } from 'next/server';

interface GeneratedContent {
  quranicVerse: {
    arabic: string;
    english: string;
    surah: string;
    ayah: string;
  };
  hadith: {
    text: string;
    source: string;
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a daily inspiration with a Quranic verse and a Hadith. Provide the Quranic verse in Arabic and English, along with its Surah and Ayah number. Also provide a relevant Hadith with its source. Format the response as a JSON object without any markdown formatting. This is attempt number ${attempt}, please ensure the content is different from previous attempts.`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Generative AI API error:', response.status, errorText);
      throw new Error(`Failed to fetch from Generative AI: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0] || !data.candidates[0].content.parts[0].text) {
      console.error('Unexpected response structure from Generative AI:', JSON.stringify(data));
      throw new Error('Unexpected response structure from Generative AI');
    }

    let generatedContent: GeneratedContent;
    try {
      generatedContent = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json\n|\n```/g, ''));
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
      hadith: `${generatedContent.hadith.text} (${generatedContent.hadith.source})`
    });
  } catch (error) {
    console.error('Error in API function:', error);
    return NextResponse.json({ 
      error: 'Failed to generate inspiration', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}