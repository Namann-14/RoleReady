'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface HeroProgressProps {
  stats: {
    activeRoadmaps: number;
    completedSkills: number;
    studyStreak: number;
    totalRoadmaps: number;
  } | null;
  userEmail: string;
}

export function HeroProgress({ stats, userEmail }: HeroProgressProps) {
  const userName = userEmail ? userEmail.split('@')[0] : 'User';
  
  if (!stats) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="h-32 bg-blue-200 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall progress (this is a simplified calculation)
  const totalPossibleSkills = stats.totalRoadmaps * 10; // Assuming average 10 skills per roadmap
  const overallProgress = totalPossibleSkills > 0 
    ? Math.min((stats.completedSkills / totalPossibleSkills) * 100, 100) 
    : 0;

  // Calculate user level based on completed skills
  const userLevel = Math.floor(stats.completedSkills / 5) + 1;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-blue-900">
              Welcome back, {userName}! 
            </CardTitle>
            <CardDescription className="text-blue-700">
              You're making great progress on your learning journey
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-200 text-blue-800">
            <Star className="w-3 h-3 mr-1" />
            Level {userLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-blue-900">Overall Progress</p>
            <Progress value={overallProgress} className="mt-2 h-3 w-full" />
            <p className="text-xs text-blue-700 mt-1">{Math.round(overallProgress)}% Complete</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-blue-900">Current Streak</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-2xl font-bold text-blue-900">{stats.studyStreak}</div>
              <div className="text-sm text-blue-700">days</div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-blue-900">Skills Mastered</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-2xl font-bold text-blue-900">{stats.completedSkills}</div>
              <div className="text-sm text-blue-700">total</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}