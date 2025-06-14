// File: Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Models.Entities;
using server.Services.Interfaces;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtHandler _jwtHandler;

        public AuthController(IUserService userService, JwtHandler jwtHandler)
        {
            _userService = userService;
            _jwtHandler = jwtHandler;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userService.ValidateUserAsync(dto.Email, dto.Password);
            if (user == null)
                return Unauthorized("Ongeldige inloggegevens.");

            var jwt = _jwtHandler.GenerateToken(user);
            return Ok(new { token = jwt });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existing = await _userService.GetByEmailAsync(dto.Email);
            if (existing != null)
                return BadRequest("Email bestaat al.");

            var newUser = await _userService.CreateUserAsync(dto.Email, dto.Password);
            var jwt = _jwtHandler.GenerateToken(newUser);
            return Created("api/auth/login", new { token = jwt });
        }

        public class LoginDto
        {
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        public class RegisterDto
        {
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }
    }
}
