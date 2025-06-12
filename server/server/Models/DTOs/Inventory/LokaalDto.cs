// File: server/Models/DTOs/Inventory/LokaalDto.cs
using System.Collections.Generic;

namespace server.Models.DTOs.Inventory
{
    public class LokaalDto
    {
        public string Name { get; set; } = null!;
        public List<SubsectionDto> Subsections { get; set; } = new();
    }
}
