import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ConnectToDatabase } from "@/lib/mongodb";
import AIRoadmap from "@/models/aiRoadmap.model";
import User from "@/models/user.model";
import { authOptions } from "@/lib/auth";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ConnectToDatabase();

    // Find the user by email to get their ObjectId
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Enhanced prompt to request JSON format
    const enhancedPrompt = `${prompt}

Please return your response as valid JSON with this exact structure:
{
  "roadmap_title": "string",
  "goal": "string", 
  "phases": [
    {
      "phase_name": "string",
      "description": "string",
      "skills_to_acquire": ["string"],
      "references": [
        {
          "title": "string",
          "type": "string",
          "link": "string"
        }
      ],
      "video_links": [
        {
          "title": "string", 
          "platform": "string",
          "link": "string"
        }
      ],
      "practice_questions": ["string"]
    }
  ],
  "general_tips": ["string"]
}

Return ONLY the JSON, no additional text or explanation.`;

    // Call Gemini API
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: enhancedPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096, // Increased token limit
          responseMimeType: "application/json", // Force JSON response
        },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      return NextResponse.json(
        { error: "Gemini API error", details: err },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    console.log("Gemini Response:", JSON.stringify(geminiData, null, 2));

    // Parse Gemini response with improved error handling
    let roadmapData;
    try {
      const responseText =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        return NextResponse.json(
          {
            error: "No response text from Gemini",
            details: geminiData,
          },
          { status: 500 }
        );
      }

      console.log("Raw Gemini Text:", responseText);

      // Try to extract JSON if response contains other text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;

      roadmapData = JSON.parse(jsonString);

      // Validate required fields
      if (!roadmapData.roadmap_title || !roadmapData.phases) {
        return NextResponse.json(
          {
            error: "Invalid roadmap structure from Gemini",
            details: roadmapData,
          },
          { status: 500 }
        );
      }
    } catch (e: any) {
      console.error("JSON Parsing Error:", e);
      return NextResponse.json(
        {
          error: "Failed to parse Gemini response as JSON",
          details: {
            error: e.message,
            responseText: geminiData.candidates?.[0]?.content?.parts?.[0]?.text,
          },
        },
        { status: 500 }
      );
    }

    // Save to MongoDB with user ObjectId
    const roadmapDoc = await AIRoadmap.create({
      user: user._id,
      roadmap_title: roadmapData.roadmap_title,
      goal: roadmapData.goal,
      phases: roadmapData.phases,
      general_tips: roadmapData.general_tips,
      geminiRaw: geminiData,
    });

    console.log("Saved Roadmap:", roadmapDoc);
    return NextResponse.json({ roadmap: roadmapDoc }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
