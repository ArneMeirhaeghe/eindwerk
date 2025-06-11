// File: server/Models/Entities/Form.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace server.Models.Entities
{
    public class Form
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;                     // Mongo ObjectId

        [BsonElement("name")]
        public string Name { get; set; } = null!;                   // Formulier‐naam

        [BsonElement("fields")]
        public List<Field> Fields { get; set; } = new();            // Alle velden
    }
}
