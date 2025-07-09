'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, CheckCircle, Trophy, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardStatsProps {
  stats: {
    activeRoadmaps: number;
    completedSkills: number;
    averageScore: number;
    studyHours: number;
  } | null;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  if (!stats) {
    return (
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Roadmaps</CardTitle>
          <Map className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats.activeRoadmaps}</div>
          <p className="text-xs text-muted-foreground">Currently learning</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Skills</CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats.completedSkills}</div>
          <p className="text-xs text-muted-foreground">Skills mastered</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
          <Trophy className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats.averageScore}%</div>
          <p className="text-xs text-muted-foreground">Quiz performance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{Math.round(stats.studyHours)}h</div>
          <p className="text-xs text-muted-foreground">Total time invested</p>
        </CardContent>
      </Card>
    </div>
  );
}