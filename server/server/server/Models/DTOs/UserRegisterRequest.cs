// server/Models/DTOs/UserRegisterRequest.cs
namespace server.Models.DTOs;

public class UserRegisterRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public string? Role { get; set; }  // Optioneel, default 'user'
}
