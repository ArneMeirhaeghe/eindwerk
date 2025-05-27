// File: Models/Item.cs
namespace server.Models
{
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;

    public class Item
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;              // Unieke identifier

        [BsonElement("name")]
        public string Name { get; set; } = null!;            // Naam van het item

        [BsonElement("quantity")]
        public int Quantity { get; set; }                    // Huidig aantal

        [BsonElement("lastQuantity")]
        public int LastQuantity { get; set; }                // Vorig aantal
    }
}
