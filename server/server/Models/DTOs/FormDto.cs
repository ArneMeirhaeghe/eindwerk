// File: server/Models/DTOs/FormDto.cs
using System.Collections.Generic;
using server.Models.DTOs.Form;

namespace server.Models.DTOs
{
    public class FormDto
    {
        public string Id { get; set; } = null!;                     // FormID
        public string Name { get; set; } = null!;                   // Naam
        public List<FieldDto> Fields { get; set; } = new();         // Velden
    }
}
