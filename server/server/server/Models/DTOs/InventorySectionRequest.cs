// server/Models/DTOs/InventorySectionRequest.cs
namespace server.Models.DTOs
{
    public class InventoryItemRequest
    {
        public string Name { get; set; } = "";
        public int CurrentCount { get; set; }
        public int ExpectedCount { get; set; }
    }

    public class InventorySectionRequest
    {
        public string Title { get; set; } = "";
        public List<InventoryItemRequest> Items { get; set; } = new();
    }
}
