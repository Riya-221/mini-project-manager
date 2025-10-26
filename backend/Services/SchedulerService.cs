using backend.Data;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class SchedulerService : ISchedulerService
    {
        private readonly ApplicationDbContext _context;

        public SchedulerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ScheduleResponse> ScheduleProjectTasksAsync(int projectId, int userId, ScheduleRequest request)
        {
            // Verify project ownership
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
                throw new UnauthorizedAccessException("Project not found or access denied");

            // Get all incomplete tasks for the project
            var incompleteTasks = await _context.Tasks
                .Where(t => t.ProjectId == projectId && !t.IsCompleted)
                .OrderBy(t => t.CreatedAt)
                .ToListAsync();

            if (incompleteTasks.Count == 0)
            {
                return new ScheduleResponse
                {
                    Message = "No incomplete tasks to schedule",
                    TasksScheduled = 0
                };
            }

            // Calculate available working days
            var workingDays = GetWorkingDays(request.StartDate, request.EndDate, request.WorkDaysPerWeek);
            var totalWorkHours = workingDays * request.HoursPerDay;

            // Estimate hours per task (simple distribution)
            var hoursPerTask = totalWorkHours / incompleteTasks.Count;

            // Schedule tasks
            var currentDate = request.StartDate;
            var hoursAccumulated = 0;
            var scheduledTasks = new List<ScheduledTaskDto>();

            foreach (var task in incompleteTasks)
            {
                hoursAccumulated += (int)hoursPerTask;

                // Move to next working day if hours exceed daily limit
                while (hoursAccumulated > request.HoursPerDay)
                {
                    currentDate = GetNextWorkingDay(currentDate, request.WorkDaysPerWeek);
                    hoursAccumulated -= request.HoursPerDay;
                }

                task.DueDate = currentDate;
                _context.Tasks.Update(task);

                scheduledTasks.Add(new ScheduledTaskDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    DueDate = task.DueDate,
                    IsCompleted = task.IsCompleted
                });

                // Move to next day for next task
                currentDate = GetNextWorkingDay(currentDate, request.WorkDaysPerWeek);
            }

            await _context.SaveChangesAsync();

            return new ScheduleResponse
            {
                ScheduledTasks = scheduledTasks,
                Message = $"Successfully scheduled {incompleteTasks.Count} tasks",
                TasksScheduled = incompleteTasks.Count
            };
        }

        private int GetWorkingDays(DateTime startDate, DateTime endDate, int workDaysPerWeek)
        {
            int workingDays = 0;
            var currentDate = startDate;

            while (currentDate <= endDate)
            {
                if (IsWorkingDay(currentDate, workDaysPerWeek))
                    workingDays++;

                currentDate = currentDate.AddDays(1);
            }

            return workingDays;
        }

        private DateTime GetNextWorkingDay(DateTime date, int workDaysPerWeek)
        {
            var nextDate = date.AddDays(1);

            while (!IsWorkingDay(nextDate, workDaysPerWeek))
            {
                nextDate = nextDate.AddDays(1);
            }

            return nextDate;
        }

        private bool IsWorkingDay(DateTime date, int workDaysPerWeek)
        {
            var dayOfWeek = (int)date.DayOfWeek;

            // If workDaysPerWeek is 5, exclude Saturday (6) and Sunday (0)
            if (workDaysPerWeek == 5)
                return dayOfWeek != 0 && dayOfWeek != 6;

            // If workDaysPerWeek is 6, exclude only Sunday (0)
            if (workDaysPerWeek == 6)
                return dayOfWeek != 0;

            // If workDaysPerWeek is 7, all days are working days
            return true;
        }
    }
}
