"use client"
import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Play } from "lucide-react"
import { toast } from "sonner"

type Props = {
    props: any
    roadmapId: string
}

const Roadmap = ({ props, roadmapId }: Props) => {
    const { phases = [] } = props || {}
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState<Set<string>>(new Set())

    // Load existing progress on component mount
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch(`/api/progress/${roadmapId}`)
                if (response.ok) {
                    const data = await response.json()
                    const completedItems = new Set<string>(
                        data.progress
                            .filter((p: any) => p.completed)
                            .map((p: any) => p.resourceId as string)
                    )
                    setCheckedItems(completedItems)
                }
            } catch (error) {
                console.error("Failed to fetch progress:", error)
            }
        }

        if (roadmapId) {
            fetchProgress()
        }
    }, [roadmapId])



    const toggleItem = async (itemId: string) => {
        const isCurrentlyChecked = checkedItems.has(itemId)
        const newStatus = !isCurrentlyChecked

        // Add to loading state
        setLoading(prev => new Set(prev).add(itemId))

        try {
            // Optimistically update UI
            const newCheckedItems = new Set(checkedItems)
            if (newStatus) {
                newCheckedItems.add(itemId)
            } else {
                newCheckedItems.delete(itemId)
            }
            setCheckedItems(newCheckedItems)

            // Send API request
            const response = await fetch(`/api/progress/${roadmapId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resourceId: itemId,
                    completed: newStatus,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
        } catch (error: any) {
            // Revert optimistic update on error
            const revertedItems = new Set(checkedItems)
            if (!newStatus) {
                revertedItems.add(itemId)
            } else {
                revertedItems.delete(itemId)
            }
            setCheckedItems(revertedItems)

            console.error("Failed to update progress:", error)
            toast.error(`Failed to update progress: ${error.message}`)
        } finally {
            // Remove from loading state
            setLoading(prev => {
                const newLoading = new Set(prev)
                newLoading.delete(itemId)
                return newLoading
            })
        }
    }



    const isChecked = (itemId: string) => checkedItems.has(itemId)
    const isLoading = (itemId: string) => loading.has(itemId)

    return (
        <div className="px-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{props?.roadmap_title || "Loading..."}</h1>
                <p className="text-muted-foreground text-lg">
                    {props?.goal || "No description available for this roadmap."}
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-0">
                {phases.map((phase: any, idx: number) => (
                    <AccordionItem value={`item-${idx}`} key={idx} className="border rounded-lg px-6 py-2 shadow-sm bg-card">
                        <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-xs">
                                    Phase {idx + 1}
                                </Badge>
                                <span className="font-semibold text-lg">{phase.phase_name}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-2">
                            <p className="text-muted-foreground leading-relaxed -mt-2 font-semibold mb-4">{phase.description}</p>

                            {/* Skills to Acquire */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    Skills to Acquire
                                    <Badge variant="secondary" className="text-xs">
                                        {phase.skills_to_acquire?.length || 0}
                                    </Badge>
                                </h3>
                                <div className="space-y-2">
                                    {phase.skills_to_acquire?.map((skill: string, i: number) => {
                                        const itemId = `skill-${idx}-${i}`
                                        return (
                                            <div key={i} className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={itemId}
                                                    checked={isChecked(itemId)}
                                                    onCheckedChange={() => toggleItem(itemId)}
                                                    disabled={isLoading(itemId)}
                                                    className="border-2 border-blue-300"
                                                />
                                                <label
                                                    htmlFor={itemId}
                                                    className={`text-sm cursor-pointer transition-all ${isChecked(itemId)
                                                            ? "line-through text-muted-foreground"
                                                            : "text-foreground hover:text-primary"
                                                        } ${isLoading(itemId) ? "opacity-50" : ""}`}
                                                >
                                                    {skill}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* References */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    References
                                    <Badge variant="secondary" className="text-xs">
                                        {phase.references?.length || 0}
                                    </Badge>
                                </h3>
                                <div className="space-y-2">
                                    {phase.references?.map((ref: any, i: number) => {
                                        const itemId = `ref-${idx}-${i}`
                                        return (
                                            <div key={i} className="flex items-start space-x-3">
                                                <Checkbox
                                                    id={itemId}
                                                    checked={isChecked(itemId)}
                                                    onCheckedChange={() => toggleItem(itemId)}
                                                    disabled={isLoading(itemId)}
                                                    className="border-2 border-blue-300"
                                                />
                                                <div className="flex-1">
                                                    <a
                                                        href={ref.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`text-sm inline-flex items-center gap-1 transition-all ${isChecked(itemId) ? "line-through text-muted-foreground" : "text-primary hover:underline"
                                                            } ${isLoading(itemId) ? "opacity-50" : ""}`}
                                                    >
                                                        {ref.title}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                    <Badge variant="outline" className="ml-2 text-xs">
                                                        {ref.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Videos */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    Videos
                                    <Badge variant="secondary" className="text-xs">
                                        {phase.video_links?.length || 0}
                                    </Badge>
                                </h3>
                                <div className="space-y-2">
                                    {phase.video_links?.map((vid: any, i: number) => {
                                        const itemId = `vid-${idx}-${i}`
                                        return (
                                            <div key={i} className="flex items-start space-x-3">
                                                <Checkbox
                                                    id={itemId}
                                                    checked={isChecked(itemId)}
                                                    onCheckedChange={() => toggleItem(itemId)}
                                                    disabled={isLoading(itemId)}
                                                    className="border-2 border-blue-300"
                                                />
                                                <div className="flex-1">
                                                    <a
                                                        href={vid.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`text-sm inline-flex items-center gap-1 transition-all ${isChecked(itemId) ? "line-through text-muted-foreground" : "text-primary hover:underline"
                                                            } ${isLoading(itemId) ? "opacity-50" : ""}`}
                                                    >
                                                        <Play className="h-3 w-3" />
                                                        {vid.title}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                    <Badge variant="outline" className="ml-2 text-xs">
                                                        {vid.platform}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default Roadmap