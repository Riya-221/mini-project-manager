"use client"

import "../styles/components.css"

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
    <div className={`task-item ${task.isCompleted ? "completed" : ""}`}>
      <div className="task-content">
        <input type="checkbox" checked={task.isCompleted} onChange={() => onToggle(task)} className="task-checkbox" />
        <div className="task-info">
          <h4>{task.title}</h4>
          {task.description && <p className="task-description">{task.description}</p>}
          {task.dueDate && <span className="task-due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
        </div>
      </div>
      <button onClick={() => onDelete(task.id)} className="btn-delete" title="Delete task">
        ×
      </button>
    </div>
  )
}
