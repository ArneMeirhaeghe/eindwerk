// File: server/Models/DTOs/FieldDto.cs
using System.Collections.Generic;

namespace server.Models.DTOs.Form
{
    public class FieldDto
    {
        public string Id { get; set; } = null!;                     // Veld‐ID
        public string Type { get; set; } = null!;                   // Type
        public string Label { get; set; } = null!;                  // Label
        public Dictionary<string, object> Settings { get; set; } = new(); // Instellingen
        public int Order { get; set; }                                // Volgorde
    }
}
