using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using server.Models.DTOs;
using server.Services;
using server.Helpers;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _us;
    private readonly JwtHandler _jwt;
    private readonly EmailService _email;

    public AuthController(
        UserService us,
        JwtHandler jwt,
        EmailService email)
    {
        _us = us;
        _jwt = jwt;
        _email = email;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await _us.GetByEmailAsync(dto.Email) != null)
            return BadRequest("Email al in gebruik");

        var user = await _us.CreateAsync(dto.Email, dto.Password);
        var link = $"https://yourapp.com/verify?uid={user.Id}";
        await _email.SendEmailVerificationAsync(user.Email, link);
        return Ok("Registratie gelukt, check je mailbox.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var u = await _us.GetByEmailAsync(dto.Email);
        if (u == null || !BCrypt.Net.BCrypt.Verify(dto.Password, u.PasswordHash))
            return Unauthorized("Ongeldige gegevens");
        //if (!u.IsEmailVerified)
        //    return BadRequest("Email niet geverifieerd");

        var token = _jwt.GenerateToken(u);
        return Ok(new { Token = token });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> Forgot([FromBody] string email)
    {
        var u = await _us.GetByEmailAsync(email);
        if (u == null) return NotFound();
        var link = $"https://yourapp.com/reset?uid={u.Id}";
        await _email.SendPasswordResetAsync(email, link);
        return Ok("Reset-mail verzonden.");
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> Change(ChangePasswordDto dto)
    {
        var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var u = await _us.GetByIdAsync(uid);
        if (u == null) return Unauthorized();
        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, u.PasswordHash))
            return BadRequest("Huidig wachtwoord fout");

        u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _us.UpdateAsync(u);
        return Ok("Wachtwoord aangepast.");
    }
}
