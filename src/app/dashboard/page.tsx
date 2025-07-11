'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Map, BookOpen, Trophy, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { HeroProgress } from "@/components/dashboard/hero-progress"
import { ActiveRoadmaps } from "@/components/dashboard/active-roadmaps"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { toast } from "sonner" // Make sure this import is correct
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ApiError } from "next/dist/server/api-utils"

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>('');
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    roadmaps: null,
    activities: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      toast.error("Please sign in to access the dashboard"); // Use toast.error for better styling
      router.push('/login');
      return;
    }

    // Fetch data if authenticated
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all dashboard data in parallel
      const [statsRes, roadmapsRes, activitiesRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/roadmaps'),
        fetch('/api/dashboard/activity')
      ]);

      const [stats, roadmaps, activities] = await Promise.all([
        statsRes.json(),
        roadmapsRes.json(),
        activitiesRes.json()
      ]);

      setDashboardData({
        stats: statsRes.ok ? stats : null,
        roadmaps: roadmapsRes.ok ? roadmaps : null,
        activities: activitiesRes.ok ? activities : null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

const handleGenerateRoadmap = async () => {
  if (!prompt.trim()) {
    toast.error("Please enter a prompt");
    return;
  }

  try {
    toast.loading("Generating roadmap...", { id: 'roadmap-generation' });
    
    const response = await fetch("/api/roadmap/generate", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    toast.success("Roadmap generated successfully!", { id: 'roadmap-generation' });
    
    // Clear the prompt
    setPrompt('');
    
    // Refresh dashboard data to show new roadmap
    await fetchDashboardData();
    
    if (data.roadmapId) {
      router.push(`/dashboard/roadmaps/${data.roadmapId}`);
    }
    
    return data;
    
  } catch (error: ApiError | any) {
    console.error('Error generating roadmap:', error);
    toast.error(error.message || "Failed to generate roadmap. Please try again.", { id: 'roadmap-generation' });
  }
};
  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (middleware will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Hero Progress Section */}
        <HeroProgress
          stats={dashboardData.stats}
          userEmail={session?.user?.email || ''}
        />

        {/* Stats Cards */}
        <DashboardStats stats={dashboardData.stats} />

        {/* Active Roadmaps and Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <ActiveRoadmaps roadmaps={dashboardData.roadmaps} />
          <RecentActivity activities={dashboardData.activities} />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump back into your learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="h-20 flex-col gap-2" >
                    <Map className="h-6 w-6" />
                    <span>Generate Roadmap</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>Generate Roadmap</DrawerTitle>
                      <DrawerDescription>Select a topic to generate a personalized learning roadmap.</DrawerDescription>
                    </DrawerHeader>
                    <div>
                      <Label htmlFor="roadmap-prompt" className="block mb-2">
                        Roadmap Topic
                      </Label>
                      <Input
                        id="roadmap-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. Web Development, Data Science"
                        className="w-full border-4 placeholder:text-gray-500 -mb-5"
                      />
                    </div>
                    <DrawerFooter>
                      <Button
                        variant="outline"
                        className="mt-4 w-full"
                        onClick={() => {
                          handleGenerateRoadmap();
                          toast.success("Roadmap generation submitted!");
                          router.push('/dashboard/roadmaps/generate');
                        }}
                      >Submit</Button>
                      <DrawerClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-blue-200 hover:bg-blue-50"
                onClick={() => {
                  toast.success("Opening quiz section...");
                  router.push('/dashboard/quizzes/take');
                }}
              >
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span>Take Quiz</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-blue-200 hover:bg-blue-50"
                onClick={() => {
                  toast.success("Opening certificates...");
                  router.push('/dashboard/progress/certificates');
                }}
              >
                <Trophy className="h-6 w-6 text-blue-600" />
                <span>View Certificates</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-blue-200 hover:bg-blue-50"
                onClick={() => toast.info("Community feature coming soon!")}
              >
                <Users className="h-6 w-6 text-blue-600" />
                <span>Join Community</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}