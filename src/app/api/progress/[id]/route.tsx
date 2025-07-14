import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ConnectToDatabase } from '@/lib/mongodb';
import User from '@/models/user.model';
import RoadmapProgress from '@/models/roadmapProgress.model';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roadmapId = params.id;
    await ConnectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let progress = await RoadmapProgress.findOne({ 
      user: user._id, 
      roadmapId: roadmapId 
    });

    if (!progress) {
      // Create new progress record if it doesn't exist
      progress = await RoadmapProgress.create({
        user: user._id,
        roadmapId: roadmapId,
        progress: [],
        certificateIssued: false,
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roadmapId = params.id;
    const body = await request.json();
    const { resourceId, completed } = body;

    if (!resourceId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    await ConnectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let progress = await RoadmapProgress.findOne({ 
      user: user._id, 
      roadmapId: roadmapId 
    });

    if (!progress) {
      // Create new progress record
      progress = await RoadmapProgress.create({
        user: user._id,
        roadmapId: roadmapId,
        progress: [{ resourceId, completed }],
        certificateIssued: false,
      });
    } else {
      // Update existing progress
      const existingIndex = progress.progress.findIndex(
        (p: any) => p.resourceId === resourceId
      );

      if (existingIndex >= 0) {
        // Update existing item
        progress.progress[existingIndex].completed = completed;
      } else {
        // Add new item
        progress.progress.push({ resourceId, completed });
      }

      await progress.save();
    }

    return NextResponse.json({ 
      success: true, 
      progress: progress.progress.find((p: any) => p.resourceId === resourceId)
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}