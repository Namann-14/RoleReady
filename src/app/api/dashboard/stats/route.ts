import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ConnectToDatabase } from '@/lib/mongodb';
import User from '@/models/user.model';
import AIRoadmap from '@/models/aiRoadmap.model';
import RoadmapProgress from '@/models/roadmapProgress.model';
import QuizAttempt from '@/models/quizAttempt.model';
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

    // Get all roadmaps for this user
    const allRoadmaps = await AIRoadmap.find({ user: user._id });
    const totalRoadmaps = allRoadmaps.length;

    // Get all progress records
    const roadmapProgress = await RoadmapProgress.find({ user: user._id });

    // Calculate roadmap completion stats
    let activeRoadmaps = 0;
    let completedRoadmaps = 0;
    let totalCompletedItems = 0;
    let totalPossibleItems = 0;

    for (const roadmap of allRoadmaps) {
      const progress = roadmapProgress.find(rp => rp.roadmapId === roadmap._id.toString());
      
      // Calculate total possible items in this roadmap
      let roadmapTotalItems = 0;
      if (roadmap.phases && Array.isArray(roadmap.phases)) {
        roadmap.phases.forEach((phase: any) => {
          if (phase.skills_to_acquire) roadmapTotalItems += phase.skills_to_acquire.length;
          if (phase.references) roadmapTotalItems += phase.references.length;
          if (phase.video_links) roadmapTotalItems += phase.video_links.length;
        });
      }

      totalPossibleItems += roadmapTotalItems;

      if (progress) {
        const completedItems = progress.progress.filter((p: any) => p.completed).length;
        totalCompletedItems += completedItems;

        // Check if roadmap is completed (all items checked)
        if (roadmapTotalItems > 0 && completedItems === roadmapTotalItems) {
          completedRoadmaps++;
          // Update progress record to mark as completed if not already
          if (!progress.completedAt) {
            progress.completedAt = new Date();
            await progress.save();
          }
        } else if (completedItems > 0) {
          activeRoadmaps++;
        }
      } else if (roadmapTotalItems > 0) {
        // Roadmap exists but no progress yet
        activeRoadmaps++;
      }
    }

    // Calculate overall completion percentage
    const overallCompletion = totalPossibleItems > 0 
      ? Math.round((totalCompletedItems / totalPossibleItems) * 100)
      : 0;

    // Get quiz stats
    const quizAttempts = await QuizAttempt.find({ user: user._id }).sort({ completedAt: -1 });
    const averageScore = quizAttempts.length > 0 
      ? Math.round(quizAttempts.reduce((sum, quiz) => sum + quiz.score, 0) / quizAttempts.length)
      : 0;

    // Calculate study streak using progress updates and quiz attempts
    const allActivities = [
      ...quizAttempts.map(q => ({ completedAt: q.completedAt })),
      ...roadmapProgress.flatMap(rp => 
        rp.progress
          .filter((p: any) => p.completed)
          .map(() => ({ completedAt: rp.updatedAt || rp.startedAt }))
      )
    ];

    const studyStreak = calculateStudyStreak(allActivities);

    // Calculate estimated study hours (more realistic calculation)
    const studyHours = Math.round(
      (totalCompletedItems * 0.5) + // 30 min per completed item
      (quizAttempts.length * 0.25)   // 15 min per quiz
    );

    return NextResponse.json({
      totalRoadmaps,
      activeRoadmaps,
      completedRoadmaps,
      completedSkills: totalCompletedItems,
      totalPossibleItems,
      overallCompletion,
      averageScore,
      studyHours,
      studyStreak
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
  today.setHours(0, 0, 0, 0); // Reset to start of day
  
  // Get unique activity dates in descending order
  const activityDates = activities
    .map(a => {
      const date = new Date(a.completedAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .filter((date, index, array) => array.indexOf(date) === index) // Remove duplicates
    .sort((a, b) => b - a); // Sort descending (most recent first)
  
  // Check for consecutive days starting from today or yesterday
  let checkDate = today.getTime();
  let foundToday = false;
  
  for (const activityDate of activityDates) {
    if (activityDate === checkDate) {
      streak++;
      foundToday = true;
      checkDate -= 24 * 60 * 60 * 1000; // Move to previous day
    } else if (activityDate === checkDate && foundToday) {
      streak++;
      checkDate -= 24 * 60 * 60 * 1000;
    } else if (!foundToday && activityDate === today.getTime() - 24 * 60 * 60 * 1000) {
      // Started yesterday, continue streak
      streak++;
      foundToday = true;
      checkDate = activityDate - 24 * 60 * 60 * 1000;
    } else {
      break; // Streak broken
    }
  }
  
  return streak;
}