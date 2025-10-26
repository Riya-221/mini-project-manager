using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ScheduleRequest
    {
        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Range(1, 24)]
        public int HoursPerDay { get; set; } = 8;

        [Range(1, 7)]
        public int WorkDaysPerWeek { get; set; } = 5;
    }

    public class ScheduledTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class ScheduleResponse
    {
        public List<ScheduledTaskDto> ScheduledTasks { get; set; } = new();
        public string Message { get; set; } = string.Empty;
        public int TasksScheduled { get; set; }
    }
}
