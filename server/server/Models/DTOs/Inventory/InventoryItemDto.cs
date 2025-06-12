// File: server/Models/DTOs/Inventory/InventoryItemDto.cs
namespace server.Models.DTOs.Inventory
{
    public class InventoryItemDto
    {
        public string Name { get; set; } = null!;
        public int Desired { get; set; }
        public int Actual { get; set; }
    }
}
