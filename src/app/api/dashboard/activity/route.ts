import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ConnectToDatabase } from '@/lib/mongodb';
import User from '@/models/user.model';
import AIRoadmap from '@/models/aiRoadmap.model';
import QuizAttempt from '@/models/quizAttempt.model';
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

    const activities = [];

    // Get recent quiz attempts
    const recentQuizzes = await QuizAttempt.find({ user: user._id })
      .sort({ completedAt: -1 })
      .limit(3);

    recentQuizzes.forEach(quiz => {
      activities.push({
        type: 'quiz',
        title: `Completed quiz (Score: ${quiz.score}%)`,
        timestamp: quiz.completedAt,
        icon: 'BookOpen'
      });
    });

    // Get recent roadmap creations
    const recentRoadmaps = await AIRoadmap.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(2);

    recentRoadmaps.forEach(roadmap => {
      activities.push({
        type: 'roadmap',
        title: `Started "${roadmap.roadmap_title}" roadmap`,
        timestamp: roadmap.createdAt,
        icon: 'Target'
      });
    });

    // Get recent progress updates
    const recentProgress = await RoadmapProgress.find({ user: user._id })
      .sort({ updatedAt: -1 })
      .limit(2);

    for (const progress of recentProgress) {
      const roadmap = await AIRoadmap.findById(progress.roadmapId);
      if (roadmap) {
        const completedCount = progress.progress.filter((p: { completed: boolean }) => p.completed).length;
        activities.push({
          type: 'progress',
          title: `Made progress on "${roadmap.roadmap_title}" (${completedCount} skills completed)`,
          timestamp: progress.updatedAt,
          icon: 'CheckCircle'
        });
      }
    }

    // Sort all activities by timestamp and take the most recent 5
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return NextResponse.json(sortedActivities);

  } catch (error) {
    console.error('Dashboard activity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}