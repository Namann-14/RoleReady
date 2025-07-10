'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SidebarInset } from "@/components/ui/sidebar";
import { toast } from 'sonner';

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

  return (
    <SidebarInset>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-600 font-semibold">{error}</div>
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">
            Roadmap: {data?.title || params.id}
          </h1>
        </div>
      )}
    </SidebarInset>
  );
}