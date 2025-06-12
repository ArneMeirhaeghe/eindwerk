// File: server/Models/DTOs/Form/FormDto.cs
using System.Collections.Generic;

namespace server.Models.DTOs.Form
{
    public class FormDto
    {
        public string Id { get; set; } = null!;                    // Form-ID
        public string Name { get; set; } = null!;                  // Form-naam
        public string UserId { get; set; } = null!;                // Eigenaar (user)
        public List<FieldDto> Fields { get; set; } = new();        // Alle velden
    }
}
