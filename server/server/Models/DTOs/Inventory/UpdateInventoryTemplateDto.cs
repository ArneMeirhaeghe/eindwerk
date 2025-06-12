// File: server/Models/DTOs/Inventory/UpdateInventoryTemplateDto.cs
using System.Collections.Generic;

namespace server.Models.DTOs.Inventory
{
    public class UpdateInventoryTemplateDto
    {
        public string Naam { get; set; } = null!;
        public List<LokaalDto> Lokalen { get; set; } = new();
    }
}
