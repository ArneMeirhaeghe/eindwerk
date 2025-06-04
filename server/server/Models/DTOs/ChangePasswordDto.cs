// File: server/Models/DTOs/ChangePasswordDto.cs
namespace server.Models.DTOs
{
    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
