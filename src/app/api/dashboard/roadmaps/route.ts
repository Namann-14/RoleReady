import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ConnectToDatabase } from '@/lib/mongodb';
import User from '@/models/user.model';
import AIRoadmap from '@/models/aiRoadmap.model';
import RoadmapProgress from '@/models/roadmapProgress.model';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ConnectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's roadmaps with progress
    const roadmaps = await AIRoadmap.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);
    const roadmapProgress = await RoadmapProgress.find({ user: user._id });

    const roadmapsWithProgress = roadmaps.map(roadmap => {
      const progress = roadmapProgress.find(rp => rp.roadmapId === roadmap._id.toString());
      
      // Calculate total skills in roadmap
      const totalSkills = roadmap.phases.reduce((total: number, phase: { skills_to_acquire: any[] }) => {
        return total + phase.skills_to_acquire.length;
      }, 0);

      // Calculate completed skills
      const completedSkills = progress 
        ? progress.progress.filter((p: { completed: boolean }) => p.completed).length 
        : 0;

      const progressPercentage = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

      // Determine current phase
      let currentPhase = roadmap.phases[0]?.phase_name || 'Getting Started';
      if (progress && progressPercentage > 0) {
        const phaseProgress = Math.floor((progressPercentage / 100) * roadmap.phases.length);
        currentPhase = roadmap.phases[Math.min(phaseProgress, roadmap.phases.length - 1)]?.phase_name || currentPhase;
      }

      return {
        _id: roadmap._id,
        title: roadmap.roadmap_title,
        currentPhase,
        progress: progressPercentage,
        isCompleted: progress?.completedAt ? true : false,
        startedAt: progress?.startedAt || roadmap.createdAt
      };
    });

    return NextResponse.json(roadmapsWithProgress);

  } catch (error) {
    console.error('Dashboard roadmaps error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}