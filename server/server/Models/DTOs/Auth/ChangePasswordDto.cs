// File: Models/DTOs/Auth/ChangePasswordDto.cs
namespace server.Models.DTOs.Auth
{
    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}
