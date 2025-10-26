"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

interface Project {
  id: number
  title: string
  description?: string
  createdAt: string
  taskCount: number
}

interface ProjectCardProps {
  project: Project
  onDelete: (id: number) => void
  onClick: () => void
}

export default function ProjectCard({ project, onDelete, onClick }: ProjectCardProps) {
  return (
    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground line-clamp-2">{project.title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(project.id)
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          ×
        </Button>
      </div>

      {project.description && <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {project.taskCount} task{project.taskCount !== 1 ? "s" : ""}
        </span>
        <span>{formatDate(project.createdAt)}</span>
      </div>
    </Card>
  )
}
