"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProjectById, createTask, updateTask, deleteTask } from "@/lib/api-client"
import TaskItem from "@/components/task-item"
import { TaskScheduler } from "@/components/task-scheduler"

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

type FilterType = "all" | "active" | "completed"
type SortType = "created" | "dueDate" | "title"

export default function ProjectDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskDueDate, setTaskDueDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [sortType, setSortType] = useState<SortType>("created")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetchProject()
  }, [projectId, router])

  const fetchProject = async () => {
    try {
      const data = await getProjectById(Number.parseInt(projectId))
      setProject(data)
    } catch (err) {
      setError("Failed to load project")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
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
    } catch (err) {
      setError("Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleTask = async (task: Task) => {
    try {
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
    } catch (err) {
      setError("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(Number.parseInt(projectId), taskId)
        if (project) {
          setProject({
            ...project,
            tasks: project.tasks.filter((t) => t.id !== taskId),
          })
        }
      } catch (err) {
        setError("Failed to delete task")
      }
    }
  }

  const getFilteredAndSortedTasks = () => {
    if (!project) return []

    let filtered = project.tasks

    // Apply filter
    if (filterType === "active") {
      filtered = filtered.filter((t) => !t.isCompleted)
    } else if (filterType === "completed") {
      filtered = filtered.filter((t) => t.isCompleted)
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortType === "created") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortType === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else if (sortType === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

    return sorted
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert variant="destructive">
            <AlertDescription>Project not found</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const filteredTasks = getFilteredAndSortedTasks()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="mb-4">
            ← Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
            {project.description && <p className="text-muted-foreground mt-2">{project.description}</p>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <TaskScheduler projectId={Number.parseInt(projectId)} onScheduleComplete={fetchProject} />
        </div>

        {/* Add Task Section */}
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} size="lg" className="mb-8">
            + Add Task
          </Button>
        ) : (
          <Card className="mb-8 p-6">
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input
                  id="taskTitle"
                  type="text"
                  placeholder="Enter task title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskDescription">Description (optional)</Label>
                <textarea
                  id="taskDescription"
                  placeholder="Enter task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskDueDate">Due Date (optional)</Label>
                <Input
                  id="taskDueDate"
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Adding...
                    </>
                  ) : (
                    "Add Task"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Tasks Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Tasks ({filteredTasks.length})</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 sm:flex-none">
                <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 sm:flex-none">
                <Select value={sortType} onValueChange={(value) => setSortType(value as SortType)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created">Newest First</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {filterType === "all" ? "No tasks yet. Add one to get started!" : "No tasks match your filter."}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
