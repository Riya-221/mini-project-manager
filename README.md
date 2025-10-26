# Project Manager Application

A lightweight task management system featuring a C# .NET 8 REST API backend paired with a React TypeScript frontend. This application enables seamless project organization, task tracking, and secure user authentication through JWT tokens.

## What Can You Do?

✨ **Core Capabilities**
- Secure authentication system using JWT
- Full CRUD operations for both projects and tasks
- Toggle task completion status effortlessly
- Smart filtering: view all tasks, only active ones, or completed items
- Flexible sorting options: organize by creation time, deadline, or alphabetically
- Clean, mobile-friendly interface
- No complex database setup—everything runs in memory

## What You'll Need

Make sure these are installed on your machine:

- **.NET 8 SDK** → [Get it here](https://dotnet.microsoft.com/download)
- **Node.js (version 18 or newer)** → [Download](https://nodejs.org)
- **npm** (automatically included with Node.js)

## How Everything is Organized

```
mini-project-manager/
├── backend/                    # .NET 8 Web API
│   ├── Controllers/           # Route handlers
│   ├── Models/                # Entity definitions
│   ├── Services/              # Core logic
│   ├── DTOs/                  # Request/response objects
│   ├── Data/                  # Data context
│   └── Program.cs             # Entry point
├── frontend/                  # React UI
│   ├── src/
│   │   ├── pages/            # View components
│   │   ├── components/       # Shared UI elements
│   │   ├── services/         # Backend communication
│   │   └── App.tsx           # Root component
│   └── package.json
└── README.md
```

## Getting the Backend Running

**Step 1:** Open your terminal and go to the backend folder
```bash
cd backend
```

**Step 2:** Pull in all necessary packages
```bash
dotnet restore
```

**Step 3:** Fire up the server
```bash
dotnet run
```

Your API will be live at `http://localhost:5000`. Want to explore the endpoints? Check out the Swagger docs at `http://localhost:5000/swagger`.

## Setting Up the Frontend

**Step 1:** Navigate to the frontend directory
```bash
cd frontend
```

**Step 2:** Install all dependencies
```bash
npm install
```

**Step 3:** Start the development server
```bash
npm run dev
```

Your app will launch at `http://localhost:5173` (might use a different port if 5173 is busy).

## Running the Complete Application

You'll need two terminal windows open:

**First Terminal** (for the API):
```bash
cd backend
dotnet run
```

**Second Terminal** (for the UI):
```bash
cd frontend
npm run dev
```

Once both are running, open `http://localhost:5173` in your browser and you're good to go!

## API Reference

### User Authentication

**Sign Up**  
`POST /api/auth/register`
```json
{
  "email": "yourname@email.com",
  "password": "securepass123",
  "username": "yourname"
}
```

**Sign In**  
`POST /api/auth/login`
```json
{
  "email": "yourname@email.com",
  "password": "securepass123"
}
```

### Managing Projects

- `GET /api/projects` → Fetch all your projects (auth required)
- `GET /api/projects/{projectId}` → Get specific project details (auth required)
- `POST /api/projects` → Add a new project (auth required)
  ```json
  {
    "title": "My New Project",
    "description": "What this project is about"
  }
  ```
- `DELETE /api/projects/{projectId}` → Remove a project (auth required)

### Working with Tasks

- `GET /api/projects/{projectId}/tasks` → List all tasks in a project (auth required)
- `POST /api/projects/{projectId}/tasks` → Add a task (auth required)
  ```json
  {
    "title": "Task to complete",
    "description": "More details here",
    "dueDate": "2025-12-31"
  }
  ```
- `PUT /api/projects/{projectId}/tasks/{taskId}` → Modify a task (auth required)
  ```json
  {
    "title": "Updated task name",
    "isCompleted": true,
    "dueDate": "2025-12-31"
  }
  ```
- `DELETE /api/projects/{projectId}/tasks/{taskId}` → Remove a task (auth required)

## Configuration Options

### Frontend Environment Variables

If needed, create `.env.local` in the frontend folder:
```
VITE_API_URL=http://localhost:5000/api
```
*This defaults to `http://localhost:5000/api` if not specified*

### Backend Settings

The application stores data in memory by default—perfect for development. The JWT secret uses a default value during development. Remember to update it before deploying to production in `Program.cs`.

## How to Use This App

### Getting Started
1. Open the app and head to the login screen
2. New here? Click "Sign up" and create your account
3. Fill in your email, choose a password, and pick a username
4. You'll be sent to the login page—enter your details
5. Welcome to your dashboard!

### Working with Projects
- Hit the "New Project" button on your main screen
- Give it a name and description (description is optional)
- Save it and you're done

### Managing Your Tasks
- Select any project to see its tasks
- Click "Add Task" to create something new
- Fill in the task name, add notes if you want, and set a deadline
- Use filters to focus on specific tasks (all, active, or finished)
- Sort your tasks however makes sense to you
- Check off tasks when you complete them
- Delete tasks you no longer need using the trash icon

### Removing Projects
- Find the trash icon on any project card
- Click it to delete the project and all its tasks

## Running Into Issues?

**Backend Problems**
- Verify .NET 8 is installed: run `dotnet --version`
- Make sure port 5000 isn't being used by something else
- Try cleaning and rebuilding: `dotnet clean` followed by `dotnet run`

**Frontend Won't Load**
- Check Node.js version: run `node --version` (needs 18+)
- Remove `node_modules` folder and `package-lock.json`, then reinstall: `npm install`
- Confirm port 5173 is free

**Can't Connect to API**
- Double-check the backend is running at `http://localhost:5000`
- Look for errors in your browser's console (F12)
- CORS should allow localhost:5173 by default
- Try clearing your browser cache and localStorage

**Login Issues**
- Clear your browser's localStorage (DevTools → Application → Local Storage)
- Sign out completely and sign back in
- Verify the JWT token is being saved in localStorage

**Missing Tasks**
- Hit refresh on your browser
- Confirm you're signed in
- Make sure the project ID in your URL actually exists
- Check the browser console for any API errors

## Technical Details

- Data is stored in memory—restarting the server wipes everything
- Authentication tokens live in your browser's localStorage
- All endpoints except login/register need authentication
- CORS allows requests from localhost:3000 and localhost:5173

## What's Next?

Some ideas for expanding this project:
- Add a real database (SQL Server, PostgreSQL, SQLite)
- Implement task priority levels and categories
- Support comments and file attachments on tasks
- Build team collaboration tools
- Set up email reminders
- Create reusable task templates
- Add reporting and analytics dashboards

## License

Free to use for learning and personal projects.