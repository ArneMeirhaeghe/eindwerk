// File: Models/DTOs/Auth/RegisterDto.cs
namespace server.Models.DTOs.Auth
{
    public class RegisterDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
