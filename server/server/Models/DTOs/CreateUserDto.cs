namespace server.Models.DTOs
{
    public class CreateUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public string? Password { get; set; }
    }

}
