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

        // Unieke eigenaar van deze template (objectId van gebruiker)
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        // Naam van de inventory template
        public string Naam { get; set; } = null!;

        // Lijst van lokalen met subsections en items
        public List<Lokaal> Lokalen { get; set; } = new();
    }
}
