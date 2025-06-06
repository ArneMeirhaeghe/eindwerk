// File: Models/DTOs/User/UpdateUserDto.cs
namespace server.Models.DTOs.User
{
    public class UpdateUserDto
    {
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
