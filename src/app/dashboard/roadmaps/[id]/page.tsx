'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from 'sonner';
import Roadmap from '@/components/current-roadmap';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@radix-ui/react-separator';

export default function Page() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (status === 'unauthenticated') {
        toast.error("Please sign in to access this roadmap");
        router.push('/login');
        return;
      }

      if (status === 'authenticated' && params.id) {
        setLoading(true);
        try {
          const res = await fetch(`/api/dashboard/roadmaps/${params.id}`);
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to fetch roadmap");
          }
          const roadmap = await res.json();
          setData(roadmap);
          setError(null);
        } catch (err: any) {
          setError(err.message);
          setData(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRoadmap();
  }, [status, router, params.id]);

  if (status === 'unauthenticated') return null;
  if (loading) return null; // Let your loading.tsx handle the spinner

  // ...existing code...
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/roadmaps">
                  Roadmaps
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {data?.roadmap_title || "Loading..."}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {error ? (
        <div className="p-4 text-red-600 font-semibold">{error}</div>
      ) : (
        <Roadmap props={data} roadmapId={params.id as string} />
      )}
    </SidebarInset>
  );
}