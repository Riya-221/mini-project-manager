"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDate } from "@/lib/utils"

interface Task {
  id: number
  title: string
  description?: string
  dueDate?: string
  isCompleted: boolean
  createdAt: string
  projectId: number
}

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (id: number) => void
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <Card className={`p-4 ${task.isCompleted ? "bg-muted" : ""}`}>
      <div className="flex items-start gap-4">
        <Checkbox checked={task.isCompleted} onCheckedChange={() => onToggle(task)} className="mt-1" />

        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className={`text-sm mt-1 ${task.isCompleted ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {task.description}
            </p>
          )}
          {task.dueDate && <p className="text-xs text-muted-foreground mt-2">Due: {formatDate(task.dueDate)}</p>}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
        >
          ×
        </Button>
      </div>
    </Card>
  )
}
