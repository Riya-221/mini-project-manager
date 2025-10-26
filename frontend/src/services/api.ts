const API_BASE_URL = "http://localhost:5000/api"

const getHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export async function registerUser(username: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ username, email, password }),
  })
  return response.json()
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  })
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
