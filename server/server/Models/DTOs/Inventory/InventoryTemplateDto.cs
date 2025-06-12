// File: server/Models/DTOs/Inventory/InventoryTemplateDto.cs
using System.Collections.Generic;

namespace server.Models.DTOs.Inventory
{
    public class InventoryTemplateDto
    {
        public string Id { get; set; } = null!;
        public string Naam { get; set; } = null!;
        public List<LokaalDto> Lokalen { get; set; } = new();
    }
}
