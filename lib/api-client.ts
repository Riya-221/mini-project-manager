const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

function getHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Login failed")
  }
  return response.json()
}

export async function register(email: string, password: string, username: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Registration failed")
  }
  return response.json()
}

export async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to fetch projects")
  return response.json()
}

export async function getProjectById(projectId: number) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to fetch project")
  return response.json()
}

export async function createProject(title: string, description?: string) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ title, description }),
  })
  if (!response.ok) throw new Error("Failed to create project")
  return response.json()
}

export async function deleteProject(projectId: number) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to delete project")
}

export async function createTask(projectId: number, title: string, description?: string, dueDate?: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ title, description, dueDate: dueDate || null }),
  })
  if (!response.ok) throw new Error("Failed to create task")
  return response.json()
}

export async function updateTask(projectId: number, taskId: number, data: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update task")
}

export async function deleteTask(projectId: number, taskId: number) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to delete task")
}

export async function scheduleProjectTasks(
  projectId: number,
  startDate: string,
  endDate: string,
  hoursPerDay = 8,
  workDaysPerWeek = 5,
) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/scheduler/schedule`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      startDate,
      endDate,
      hoursPerDay,
      workDaysPerWeek,
    }),
  })
  if (!response.ok) throw new Error("Failed to schedule tasks")
  return response.json()
}
