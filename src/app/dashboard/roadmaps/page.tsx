'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

type Roadmap = {
  _id: string;
  title: string;
  currentPhase: string;
  progress: number;
  isCompleted: boolean;
  startedAt: string;
};

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error("Please sign in to access your roadmaps");
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetchRoadmaps();
    }
  }, [status, router]);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/roadmaps');
      if (!res.ok) throw new Error("Failed to fetch roadmaps");
      const data = await res.json();
      setRoadmaps(data);
    } catch (e) {
      toast.error("Could not load roadmaps");
    } finally {
      setLoading(false);
    }
  };

  if (status === 'unauthenticated') return null;

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
                <BreadcrumbPage>Roadmaps</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="text-2xl font-bold mb-4">Your Active Roadmaps</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {roadmaps.length === 0 && (
              <div className="text-gray-500 text-center py-12">
                No active roadmaps found.
              </div>
            )}
            <div className="flex flex-col gap-6">
              {roadmaps.map((roadmap) => (
                <Card key={roadmap._id} className="flex flex-row items-center p-4 gap-6 shadow-md">
                  <div className="flex-1">
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-xl">{roadmap.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="text-gray-600 text-sm">
                          <b>Current Phase:</b> {roadmap.currentPhase}
                        </span>
                        <span className="text-gray-600 text-sm md:ml-6">
                          <b>Status:</b> {roadmap.isCompleted ? "Completed" : "Active"}
                        </span>
                        <span className="text-gray-600 text-sm md:ml-6">
                          <b>Started:</b> {new Date(roadmap.startedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-3">
                        <Progress value={roadmap.progress} className="h-3" />
                        <span className="text-xs text-gray-500 mt-1 inline-block">
                          {roadmap.progress}% complete
                        </span>
                      </div>
                    </CardContent>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <Link href={`/dashboard/roadmaps/${roadmap._id}`}>
                      <Button>
                        {roadmap.isCompleted ? "Review" : "Continue"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </SidebarInset>
  );
}