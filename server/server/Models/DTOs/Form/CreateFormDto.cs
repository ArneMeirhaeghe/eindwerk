using System.Collections.Generic;
using server.Models.DTOs.Form;

namespace server.Models.DTOs
{
    // DTO voor aanmaken, zonder Id zodat model binding niet faalt
    public class CreateFormDto
    {
        public string Name { get; set; } = null!;
        public List<FieldDto> Fields { get; set; } = new();
    }
}
