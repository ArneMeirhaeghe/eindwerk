// File: server/Controllers/AuthController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using server.Models.DTOs;
using server.Services;
using server.Helpers;
using System.Threading.Tasks;

namespace server.Controllers
{
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
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _us.GetByEmailAsync(dto.Email) != null)
                return BadRequest("Email al in gebruik");

            var user = await _us.CreateAsync(dto.Email, dto.Password);
            var link = $"https://yourapp.com/verify?uid={user.Id}";

            await _email.SendEmailVerificationAsync(user.Email, link);
            return Ok("Registratie gelukt, check je mailbox.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _us.GetByEmailAsync(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Ongeldige gegevens");

            // Optional: enforce email verification
            // if (!user.IsEmailVerified) return BadRequest("Email niet geverifieerd");

            var token = _jwt.GenerateToken(user);
            return Ok(new { Token = token });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> Forgot([FromBody] string email)
        {
            var user = await _us.GetByEmailAsync(email);
            if (user == null) return NotFound();

            var link = $"https://yourapp.com/reset?uid={user.Id}";
            await _email.SendPasswordResetAsync(email, link);
            return Ok("Reset-mail verzonden.");
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> Change([FromBody] ChangePasswordDto dto)
        {
            var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _us.GetByIdAsync(uid);
            if (user == null) return Unauthorized();

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return BadRequest("Huidig wachtwoord fout");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _us.UpdateAsync(user);
            return Ok("Wachtwoord aangepast.");
        }
    }
}
