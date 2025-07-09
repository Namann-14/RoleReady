'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface Roadmap {
  _id: string;
  title: string;
  currentPhase: string;
  progress: number;
  isCompleted: boolean;
}

interface ActiveRoadmapsProps {
  roadmaps: Roadmap[] | null;
}

export function ActiveRoadmaps({ roadmaps }: ActiveRoadmapsProps) {
  if (!roadmaps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Roadmaps</CardTitle>
          <CardDescription>Your current learning paths</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeRoadmaps = roadmaps.filter(roadmap => !roadmap.isCompleted);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Roadmaps</CardTitle>
        <CardDescription>Your current learning paths</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {activeRoadmaps.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No active roadmaps yet.</p>
              <Button className="mt-2" size="sm">
                Generate Your First Roadmap
              </Button>
            </div>
          ) : (
            activeRoadmaps.slice(0, 3).map((roadmap) => (
              <div key={roadmap._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium">{roadmap.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {roadmap.currentPhase}
                  </Badge>
                  <Progress value={roadmap.progress} className="w-full mt-2" />
                  <p className="text-xs text-muted-foreground">{roadmap.progress}% complete</p>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  Continue <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}