using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/projects/{projectId}/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst("userId");
            return int.Parse(userIdClaim?.Value ?? "0");
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(int projectId, [FromBody] CreateTaskRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = GetUserId();
                var task = await _taskService.CreateTaskAsync(projectId, userId, request);
                return CreatedAtAction(nameof(CreateTask), new { projectId }, task);
            }
            catch (InvalidOperationException)
            {
                return NotFound("Project not found");
            }
        }

        [HttpPut("{taskId}")]
        public async Task<IActionResult> UpdateTask(int projectId, int taskId, [FromBody] UpdateTaskRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var success = await _taskService.UpdateTaskAsync(taskId, userId, request);

            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int projectId, int taskId)
        {
            var userId = GetUserId();
            var success = await _taskService.DeleteTaskAsync(taskId, userId);

            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
