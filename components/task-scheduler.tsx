"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { scheduleProjectTasks } from "@/lib/api-client"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface TaskSchedulerProps {
  projectId: number
  onScheduleComplete?: () => void
}

export function TaskScheduler({ projectId, onScheduleComplete }: TaskSchedulerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hoursPerDay: 8,
    workDaysPerWeek: 5,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hoursPerDay" || name === "workDaysPerWeek" ? Number.parseInt(value) : value,
    }))
  }

  const handleSchedule = async () => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const result = await scheduleProjectTasks(
        projectId,
        formData.startDate,
        formData.endDate,
        formData.hoursPerDay,
        formData.workDaysPerWeek,
      )

      setSuccess(`${result.tasksScheduled} tasks scheduled successfully!`)
      setTimeout(() => {
        setIsOpen(false)
        onScheduleComplete?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to schedule tasks")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline" className="w-full">
        🤖 Smart Schedule Tasks
      </Button>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Smart Task Scheduler</CardTitle>
        <CardDescription>Automatically schedule your tasks based on available time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hoursPerDay">Hours Per Day</Label>
            <select
              id="hoursPerDay"
              name="hoursPerDay"
              value={formData.hoursPerDay}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              {[4, 6, 8, 10, 12].map((hours) => (
                <option key={hours} value={hours}>
                  {hours} hours
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workDaysPerWeek">Work Days Per Week</Label>
            <select
              id="workDaysPerWeek"
              name="workDaysPerWeek"
              value={formData.workDaysPerWeek}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value={5}>5 days (Mon-Fri)</option>
              <option value={6}>6 days (Mon-Sat)</option>
              <option value={7}>7 days (Every day)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-700 rounded-md">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSchedule} disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule Tasks"
            )}
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="outline" disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
