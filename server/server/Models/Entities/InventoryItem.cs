// File: server/Models/Entities/InventoryItem.cs
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models.Entities
{
    public class InventoryItem
    {
        public string Name { get; set; } = null!;
        public int Desired { get; set; }
        public int Actual { get; set; }  
    }
}
