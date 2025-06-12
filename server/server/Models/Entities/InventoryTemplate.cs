// File: server/Models/Entities/InventoryTemplate.cs
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models.Entities
{
    public class InventoryTemplate
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string Naam { get; set; } = null!;

        public List<Lokaal> Lokalen { get; set; } = new();
    }
}
