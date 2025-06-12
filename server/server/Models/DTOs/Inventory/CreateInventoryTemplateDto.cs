// File: server/Models/DTOs/Inventory/CreateInventoryTemplateDto.cs
using System.Collections.Generic;

namespace server.Models.DTOs.Inventory
{
    public class CreateInventoryTemplateDto
    {
        public string Naam { get; set; } = null!;
        public List<LokaalDto> Lokalen { get; set; } = new();
    }
}
