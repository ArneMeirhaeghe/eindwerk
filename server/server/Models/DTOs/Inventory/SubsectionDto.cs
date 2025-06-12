// File: server/Models/DTOs/Inventory/SubsectionDto.cs
using System.Collections.Generic;

namespace server.Models.DTOs.Inventory
{
    public class SubsectionDto
    {
        public string Name { get; set; } = null!;
        public List<InventoryItemDto> Items { get; set; } = new();
    }
}
