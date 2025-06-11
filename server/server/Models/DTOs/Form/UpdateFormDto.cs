// File: server/Models/DTOs/UpdateFormDto.cs
using System.Collections.Generic;
using server.Models.DTOs.Form;

namespace server.Models.DTOs
{
    // DTO voor update, zonder Id
    public class UpdateFormDto
    {
        public string Name { get; set; } = null!;
        public List<FieldDto> Fields { get; set; } = new();
    }
}
