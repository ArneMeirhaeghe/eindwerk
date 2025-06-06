// File: Models/DTOs/Tour/CreateComponentDto.cs
namespace server.Models.DTOs.Tour
{
    public class CreateComponentDto
    {
        public string Type { get; set; } = null!;
        public string PropsJson { get; set; } = null!;
    }
}
