import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ConnectToDatabase } from '@/lib/mongodb';
import User from '@/models/user.model';
import AIRoadmap from '@/models/aiRoadmap.model';
import RoadmapProgress from '@/models/roadmapProgress.model';
import QuizAttempt from '@/models/quizAttempt.model';
import { authOptions } from '@/lib/auth';
import { boolean } from 'zod';

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

    // Get roadmap stats
    const totalRoadmaps = await AIRoadmap.countDocuments({ user: user._id });
    const roadmapProgress = await RoadmapProgress.find({ user: user._id });
    const activeRoadmaps = roadmapProgress.filter(rp => !rp.completedAt).length;
    const completedRoadmaps = roadmapProgress.filter(rp => rp.completedAt).length;

    // Calculate completed skills
    const completedSkills = roadmapProgress.reduce((total, rp) => {
      return total + rp.progress.filter((p: {completed: boolean}) => p.completed).length;
    }, 0);

    // Get quiz stats
    const quizAttempts = await QuizAttempt.find({ user: user._id }).sort({ completedAt: -1 });
    const averageScore = quizAttempts.length > 0 
      ? Math.round(quizAttempts.reduce((sum, quiz) => sum + quiz.score, 0) / quizAttempts.length)
      : 0;

    // Calculate study streak (simplified - days with activity)
    const recentActivity = await QuizAttempt.find({ 
      user: user._id,
      completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ completedAt: -1 });

    const studyStreak = calculateStudyStreak(recentActivity);

    // Calculate total study hours (simplified estimation)
    const studyHours = quizAttempts.length * 0.5 + completedSkills * 1.5; // Rough estimation

    return NextResponse.json({
      activeRoadmaps,
      completedSkills,
      averageScore,
      studyHours: Math.round(studyHours),
      studyStreak,
      totalRoadmaps,
      completedRoadmaps
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateStudyStreak(activities: any[]): number {
  if (activities.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  // Simple streak calculation - consecutive days with activity
  const activityDates = activities.map(a => new Date(a.completedAt).toDateString());
  const uniqueDates = [...new Set(activityDates)].sort().reverse();
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const activityDate = new Date(uniqueDates[i]);
    const expectedDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    
    if (activityDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}