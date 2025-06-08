// File: /mnt/data/PatchFieldDto.cs

namespace server.Models.DTOs.LiveSession
{
    public class PatchFieldDto
    {
        public string SectionId { get; set; } = null!;
        public string ComponentId { get; set; } = null!;
        public object Value { get; set; } = null!;
    }
}
