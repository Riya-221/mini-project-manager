using backend.DTOs;

namespace backend.Services
{
    public interface ITaskService
    {
        Task<TaskDto?> GetTaskByIdAsync(int taskId, int userId);
        Task<TaskDto> CreateTaskAsync(int projectId, int userId, CreateTaskRequest request);
        Task<bool> UpdateTaskAsync(int taskId, int userId, UpdateTaskRequest request);
        Task<bool> DeleteTaskAsync(int taskId, int userId);
    }
}
