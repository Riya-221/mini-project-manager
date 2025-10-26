"use client"

import "../styles/components.css"

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
    <div className="project-card" onClick={onClick}>
      <div className="card-header">
        <h3>{project.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(project.id)
          }}
          className="btn-delete"
          title="Delete project"
        >
          ×
        </button>
      </div>
      {project.description && <p className="card-description">{project.description}</p>}
      <div className="card-footer">
        <span className="task-count">{project.taskCount} tasks</span>
        <span className="created-date">{new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
