using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Services;
using server.Models.DTOs;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly UserService _us;
    public AdminController(UserService us) => _us = us;

    [HttpGet("users")]
    public async Task<IActionResult> GetAll() => Ok(await _us.GetAllAsync());

    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var u = await _us.GetByIdAsync(id);
        return u == null ? NotFound() : Ok(u);
    }

    [HttpPut("users/{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto dto)
    {
        var user = await _us.GetByIdAsync(id);
        if (user == null) return NotFound();

        user.Email = dto.Email;
        user.Role = dto.Role;

        await _us.UpdateAsync(user);
        return NoContent();
    }


    [HttpDelete("users/{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _us.DeleteAsync(id);
        return NoContent();
    }
    [HttpPost("users")]
    public async Task<IActionResult> Add([FromBody] CreateUserDto dto)
    {
        var password = string.IsNullOrWhiteSpace(dto.Password) ? "Temp123!" : dto.Password;
        await _us.CreateAsync(dto.Email, password, dto.Role);
        return Ok();
    }


}
