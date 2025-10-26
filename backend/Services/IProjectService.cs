using backend.DTOs;

namespace backend.Services
{
    public interface IProjectService
    {
        Task<List<ProjectDto>> GetUserProjectsAsync(int userId);
        Task<ProjectDetailDto?> GetProjectByIdAsync(int projectId, int userId);
        Task<ProjectDto> CreateProjectAsync(int userId, CreateProjectRequest request);
        Task<bool> UpdateProjectAsync(int projectId, int userId, UpdateProjectRequest request);
        Task<bool> DeleteProjectAsync(int projectId, int userId);
    }
}
