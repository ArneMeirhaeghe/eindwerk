// File: Controllers/AdminController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using server.Models.DTOs.User;   // CreateUserDto, UpdateUserDto
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;

        public AdminController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPost("users")]
        public async Task<IActionResult> Add([FromBody] CreateUserDto dto)
        {
            var password = string.IsNullOrWhiteSpace(dto.Password)
                ? "Temp123!"
                : dto.Password;

            await _userService.CreateUserAsync(dto.Email, password, dto.Role);
            return Ok();
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound();

            user.Email = dto.Email;
            user.Role = dto.Role;
            await _userService.UpdateAsync(user);
            return NoContent();
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }
    }
}
