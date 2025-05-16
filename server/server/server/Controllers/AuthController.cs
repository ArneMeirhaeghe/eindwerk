// server/Controllers/AuthController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _users;
    private readonly AuthService _auth;

    public AuthController(UserService users, AuthService auth)
    {
        _users = users;
        _auth = auth;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterRequest req)
    {
        if (await _users.EmailExists(req.Email))
            return Conflict("Email bestaat al");

        var role = string.IsNullOrEmpty(req.Role) ? "user" : req.Role;
        var created = await _users.Register(req.Email, req.Password, role);
        var token = _auth.GenerateToken(created);
        return Ok(new { token });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest req)
    {
        if (!await _users.ValidateCredentials(req.Email, req.Password))
            return Unauthorized("Login mislukt");

        var user = await _users.GetByEmail(req.Email)!;
        var token = _auth.GenerateToken(user);
        return Ok(new { token });
    }
}
