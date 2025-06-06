// File: Models/DTOs/User/CreateUserDto.cs
namespace server.Models.DTOs.User
{
    public class CreateUserDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
