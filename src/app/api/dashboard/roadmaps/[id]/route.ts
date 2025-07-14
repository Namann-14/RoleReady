import { authOptions } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import AIRoadmap from "@/models/aiRoadmap.model";
import User from "@/models/user.model";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roadmapId } = await context.params; // <-- await params
    if (!roadmapId) {
      return NextResponse.json({ error: "Roadmap ID is required" }, { status: 400 });
    }

    await ConnectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roadmap = await AIRoadmap.findOne({ _id: roadmapId, user: user._id });
    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}