'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, BookOpen, Trophy, Target } from "lucide-react"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"

interface Activity {
  type: string;
  title: string;
  timestamp: string;
  icon: string;
}

interface RecentActivityProps {
  activities: Activity[] | null;
}

const iconMap = {
  CheckCircle,
  BookOpen,
  Trophy,
  Target
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest learning updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-4 w-4 bg-gray-200 animate-pulse rounded mt-1"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest learning updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent activity.</p>
            </div>
          ) : (
            activities.map((activity, index) => {
              const IconComponent = iconMap[activity.icon as keyof typeof iconMap] || Target;
              const iconColor = activity.type === 'quiz' ? 'text-blue-600' : 
                               activity.type === 'roadmap' ? 'text-purple-600' : 'text-green-600';
              
              return (
                <div key={index} className="flex items-start gap-3">
                  <IconComponent className={`h-4 w-4 ${iconColor} mt-1`} />
                  <div className="space-y-1">
                    <p className="text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}