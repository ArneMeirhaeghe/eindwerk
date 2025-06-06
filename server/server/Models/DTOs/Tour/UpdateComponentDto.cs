// File: Models/DTOs/Tour/UpdateComponentDto.cs
namespace server.Models.DTOs.Tour
{
    public class UpdateComponentDto
    {
        public string Type { get; set; } = null!;
        public string PropsJson { get; set; } = null!;
    }
}
