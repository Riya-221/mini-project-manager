# Task & Project Organizer

A modern web application for managing your projects and tasks efficiently. Built using C# .NET 8 for the backend API and React with TypeScript for a smooth frontend experience. Features intelligent task scheduling and secure user authentication.

## 🎯 What This App Offers

- **Secure Login System** - JWT-based authentication keeps your data safe
- **Project Management** - Create, edit, view, and remove projects with ease
- **Task Tracking** - Add tasks to projects, update their status, and organize your workflow
- **Smart Scheduling** - Automatically generate work schedules based on task deadlines and effort estimates
- **Flexible Views** - Filter by completion status, sort by date or name
- **Clean Interface** - Works great on desktop and mobile devices
- **Quick Setup** - Everything runs in memory, no complex database configuration needed

## 🛠️ Required Software

To run this application, install:

- **[.NET 8 SDK](https://dotnet.microsoft.com/download)** - Powers the backend
- **[Node.js 18+](https://nodejs.org)** - Runs the frontend (npm included)

## 📂 Project Layout

```
task-project-organizer/
├── backend/
│   ├── Controllers/      → API route handlers
│   ├── Models/           → Database entities
│   ├── Services/         → Application logic
│   ├── DTOs/             → API contracts
│   ├── Data/             → Data access layer
│   └── Program.cs        → App configuration
├── frontend/
│   ├── src/
│   │   ├── pages/       → Main views
│   │   ├── components/  → Reusable UI parts
│   │   ├── services/    → API client code
│   │   └── App.tsx      → Application root
│   └── package.json
└── README.md
```

## ⚡ Launch the Backend

Open a terminal and navigate to the backend:

```bash
cd backend
```

Download dependencies:

```bash
dotnet restore
```

Start the server:

```bash
dotnet run
```

**Backend URL:** `http://localhost:5000`  
**API Documentation:** `http://localhost:5000/swagger`

## 🎨 Launch the Frontend

In a new terminal, go to the frontend directory:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

**Frontend URL:** `http://localhost:5173`

## 🔥 Running the Full Stack

You need both servers running simultaneously:

### Terminal 1 - API Server
```bash
cd backend
dotnet run
```

### Terminal 2 - React App
```bash
cd frontend
npm run dev
```

Then visit `http://localhost:5173` in your browser!

## 🌐 API Documentation

### 🔑 Authentication Routes

| Action | Endpoint | Body |
|--------|----------|------|
| Create Account | `POST /api/auth/register` | `{ "email", "password", "username" }` |
| Sign In | `POST /api/auth/login` | `{ "email", "password" }` |

**Registration Example:**
```json
{
  "email": "john@example.com",
  "password": "securePass456",
  "username": "john_doe"
}
```

### 📋 Project Routes

All require authentication header: `Authorization: Bearer <token>`

| Action | Endpoint | Notes |
|--------|----------|-------|
| List Projects | `GET /api/projects` | Returns all user's projects |
| View Project | `GET /api/projects/{id}` | Single project details |
| New Project | `POST /api/projects` | Requires title, optional description |
| Remove Project | `DELETE /api/projects/{id}` | Deletes project & its tasks |

**Create Project:**
```json
{
  "title": "Website Redesign",
  "description": "Revamp company website with modern UI"
}
```

### ✔️ Task Routes

All require authentication.

| Action | Endpoint | Purpose |
|--------|----------|---------|
| Get Tasks | `GET /api/projects/{projectId}/tasks` | All tasks in project |
| Add Task | `POST /api/projects/{projectId}/tasks` | Create new task |
| Edit Task | `PUT /api/projects/{projectId}/tasks/{taskId}` | Update task details |
| Delete Task | `DELETE /api/projects/{projectId}/tasks/{taskId}` | Remove task |

**Task Creation:**
```json
{
  "title": "Create wireframes",
  "description": "Design initial mockups for homepage",
  "dueDate": "2025-11-15"
}
```

**Task Update:**
```json
{
  "title": "Create wireframes",
  "isCompleted": true,
  "dueDate": "2025-11-15"
}
```

### 🧠 Intelligent Scheduler

An advanced feature that automatically plans your work schedule based on task priorities and deadlines.

**Endpoint:** `POST /api/projects/{projectId}/schedule`

**Input Format:**
```json
{
  "tasks": [
    { 
      "title": "Research phase", 
      "estimatedHours": 6, 
      "dueDate": "2025-11-05" 
    },
    { 
      "title": "Development sprint", 
      "estimatedHours": 12, 
      "dueDate": "2025-11-03" 
    },
    { 
      "title": "QA testing", 
      "estimatedHours": 5, 
      "dueDate": "2025-11-08" 
    }
  ],
  "workHoursPerDay": 7
}
```

**Output Format:**
```json
{
  "schedule": [
    { 
      "task": "Development sprint", 
      "startDate": "2025-10-31", 
      "endDate": "2025-11-01" 
    },
    { 
      "task": "Research phase", 
      "startDate": "2025-11-02", 
      "endDate": "2025-11-03" 
    },
    { 
      "task": "QA testing", 
      "startDate": "2025-11-04", 
      "endDate": "2025-11-04" 
    }
  ],
  "totalDurationDays": 4
}
```

**How It Works:**
- Analyzes task deadlines and effort estimates
- Creates an optimized work plan
- Prioritizes urgent tasks first
- Displays schedule in an easy-to-read format
- Mobile responsive with loading states

## ⚙️ Configuration

### Frontend Settings

Create `.env.local` in the frontend folder (optional):

```
VITE_API_URL=http://localhost:5000/api
```

*Defaults to the above if not specified*

### Backend Settings

- Data stored in memory during development
- JWT secret configured in `Program.cs`
- Update security settings before production deployment

## 📖 User Guide

### First Time Setup
1. Open the app and locate the registration form
2. Provide an email, create a password, and choose a username
3. Submit the form to create your account
4. You'll be redirected to login - enter your credentials
5. Access your personal dashboard

### Managing Projects
- Click the "New Project" or "Create" button
- Enter a project name (required) and description (optional)
- Save to add it to your dashboard
- View all projects in a grid or list layout

### Working With Tasks
- Open any project to see its task list
- Use "Add Task" or "+" button to create new tasks
- Fill in task name, notes, and deadline
- Toggle filters to show all, active, or completed tasks
- Use sorting options to organize by priority or date
- Check the box to mark tasks complete
- Delete unwanted tasks with the delete button

### Using Auto-Scheduler
- Navigate to a project with multiple tasks
- Click "Generate Schedule" or "Auto Plan"
- System calculates optimal work timeline
- View suggested start and end dates for each task
- Adjust your calendar based on recommendations

### Deleting Projects
- Find the delete icon on any project card
- Confirm deletion (this removes all associated tasks)
- Project disappears from your dashboard

## 🔧 Common Issues & Solutions

**API Won't Start**
- Verify .NET installation: `dotnet --version` (should show 8.x)
- Check if port 5000 is available
- Run cleanup: `dotnet clean && dotnet build`

**Frontend Problems**
- Confirm Node version: `node --version` (need 18+)
- Delete `node_modules` and `package-lock.json`
- Fresh install: `npm install`
- Ensure port 5173 isn't blocked

**Connection Failures**
- Confirm backend runs on port 5000
- Check browser console (F12) for detailed errors
- Verify CORS allows localhost:5173
- Try incognito mode to rule out extensions

**Auth Not Working**
- Open DevTools → Application → Local Storage
- Clear all stored data
- Log out completely and sign back in
- Verify token appears after login

**Tasks Missing or Not Loading**
- Refresh your browser
- Confirm you're logged in (check token)
- Verify the project ID in the URL exists
- Look for errors in browser console

## 💡 Technical Notes

- **Data Persistence:** Everything stored in memory - server restart clears data
- **Token Storage:** JWT saved in browser's localStorage
- **Security:** All endpoints except auth require valid token
- **CORS:** Configured for localhost:3000 and localhost:5173
- **Scheduler Logic:** Runs entirely on backend for consistency

## 🚀 Ideas for Enhancement

Here are some ways to expand this project:

- **Database Integration** - Add PostgreSQL, MySQL, or SQLite for permanent storage
- **Priority System** - Implement high/medium/low priority levels
- **Categories & Tags** - Organize tasks with custom labels
- **Collaboration** - Multi-user access with permissions
- **Comments** - Add discussion threads to tasks
- **File Uploads** - Attach documents to tasks
- **Reminders** - Email or push notifications for deadlines
- **Task Templates** - Save and reuse common task structures
- **Analytics Dashboard** - Visualize productivity metrics
- **Advanced Scheduling** - ML-based predictions for task duration

## 📄 License

Open for educational and personal use.

---

**Built with:** C# .NET 8 • React • TypeScript • JWT Authentication