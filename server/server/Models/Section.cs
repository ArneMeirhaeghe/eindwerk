// File: Models/Section.cs
namespace server.Models
{
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    using System.Collections.Generic;

    public class Section
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;              // Unieke identifier

        [BsonElement("userId")]
        public string UserId { get; set; } = null!;          // Owner van de sectie

        [BsonElement("name")]
        public string Name { get; set; } = null!;            // Naam van de sectie

        [BsonElement("items")]
        public List<Item> Items { get; set; } = new();       // Items in deze sectie
    }
}
