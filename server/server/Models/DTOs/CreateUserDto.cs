// File: server/Models/DTOs/CreateUserDto.cs
namespace server.Models.DTOs
{
    public class CreateUserDto
    {
        public string Email { get; set; }
        public string Password { get; set; } // Optional: if empty, backend will assign a temporary password
        public string Role { get; set; }
    }
}
