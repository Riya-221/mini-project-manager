using backend.DTOs;

namespace backend.Services
{
    public interface ISchedulerService
    {
        Task<ScheduleResponse> ScheduleProjectTasksAsync(int projectId, int userId, ScheduleRequest request);
    }
}
