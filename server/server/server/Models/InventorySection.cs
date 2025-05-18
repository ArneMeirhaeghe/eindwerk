// server/Models/InventorySection.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class InventorySection
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // OwnerId blijft ObjectId-string
        public string OwnerId { get; set; } = "";
        public string Title { get; set; } = "";

        // Lijst van items met string-Id’s
        public List<InventoryItem> Items { get; set; } = new();
    }
}
