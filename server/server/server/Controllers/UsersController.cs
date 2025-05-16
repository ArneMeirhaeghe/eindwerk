// server/Controllers/UsersController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Models.DTOs;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class UsersController : ControllerBase
{
    private readonly UserService _users;
    public UsersController(UserService users) => _users = users;

    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAll() =>
        Ok(await _users.GetAll());

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetById(string id)
    {
        var u = await _users.GetById(id);
        return u is null ? NotFound() : Ok(u);
    }

    [HttpPost]
    public async Task<ActionResult<User>> Create([FromBody] UserRegisterRequest req)
    {
        var u = await _users.Register(req.Email, req.Password, req.Role ?? "user");
        return CreatedAtAction(nameof(GetById), new { id = u.Id }, u);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UserUpdateRequest req)
    {
        if (await _users.Update(id, req))
            return NoContent();
        return NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _users.Delete(id);
        return NoContent();
    }
}
