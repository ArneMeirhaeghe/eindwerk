// server/Models/DTOs/UserLoginRequest.cs
namespace server.Models.DTOs;

public class UserLoginRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}
