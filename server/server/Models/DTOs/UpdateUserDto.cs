﻿namespace server.Models.DTOs
{
    public class UpdateUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
    }
}
