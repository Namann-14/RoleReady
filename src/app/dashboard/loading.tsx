import { SidebarInset } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <SidebarInset>
      <motion.div
        className="flex flex-col items-center justify-center h-[60vh] w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-6"></div>
        <p className="text-lg text-gray-700">Loading your roadmaps...</p>
      </motion.div>
    </SidebarInset>
  );
}