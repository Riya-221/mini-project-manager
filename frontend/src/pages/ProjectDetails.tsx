"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProjectById, createTask, updateTask, deleteTask } from "../services/api"
import TaskItem from "../components/TaskItem"
import "../styles/project-details.css"

interface Task {
  id: number
  title: string
  description?: string
  dueDate?: string
  isCompleted: boolean
  createdAt: string
  projectId: number
}

interface Project {
  id: number
  title: string
  description?: string
  createdAt: string
  tasks: Task[]
}

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskDueDate, setTaskDueDate] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      if (projectId) {
        const data = await getProjectById(Number.parseInt(projectId))
        setProject(data)
      }
    } catch (err) {
      setError("Failed to load project")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (projectId) {
        const newTask = await createTask(Number.parseInt(projectId), taskTitle, taskDescription, taskDueDate)
        if (project) {
          setProject({
            ...project,
            tasks: [newTask, ...project.tasks],
          })
        }
        setTaskTitle("")
        setTaskDescription("")
        setTaskDueDate("")
        setShowForm(false)
      }
    } catch (err) {
      setError("Failed to create task")
    }
  }

  const handleToggleTask = async (task: Task) => {
    try {
      if (projectId) {
        await updateTask(Number.parseInt(projectId), task.id, {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          isCompleted: !task.isCompleted,
        })
        if (project) {
          setProject({
            ...project,
            tasks: project.tasks.map((t) => (t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t)),
          })
        }
      }
    } catch (err) {
      setError("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        if (projectId) {
          await deleteTask(Number.parseInt(projectId), taskId)
          if (project) {
            setProject({
              ...project,
              tasks: project.tasks.filter((t) => t.id !== taskId),
            })
          }
        }
      } catch (err) {
        setError("Failed to delete task")
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading project...</div>
  }

  if (!project) {
    return <div className="error-message">Project not found</div>
  }

  return (
    <div className="project-details">
      <header className="project-header">
        <button onClick={() => navigate("/dashboard")} className="btn btn-secondary">
          ← Back
        </button>
        <div>
          <h1>{project.title}</h1>
          {project.description && <p className="project-description">{project.description}</p>}
        </div>
      </header>

      <main className="project-main">
        {error && <div className="error-message">{error}</div>}

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-large">
            + Add Task
          </button>
        ) : (
          <form onSubmit={handleCreateTask} className="task-form">
            <div className="form-group">
              <label htmlFor="taskTitle">Task Title</label>
              <input
                id="taskTitle"
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="taskDescription">Description (optional)</label>
              <textarea
                id="taskDescription"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task description"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="taskDueDate">Due Date (optional)</label>
              <input
                id="taskDueDate"
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="tasks-section">
          <h2>Tasks ({project.tasks.length})</h2>
          {project.tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {project.tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
