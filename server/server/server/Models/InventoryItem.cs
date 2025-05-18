// server/Models/InventoryItem.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class InventoryItem
    {
        // UUID of front-end, sla op als STRING
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = "";

        public string Name { get; set; } = "";
        public int CurrentCount { get; set; }
        public int ExpectedCount { get; set; }
    }
}
