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
        public string Id { get; set; } = null!;                    // Mongo ObjectId

        [BsonElement("name")]
        public string Name { get; set; } = null!;                  // Form-naam

        [BsonElement("userId")]
        public string UserId { get; set; } = null!;                // Eigenaar (user)

        [BsonElement("fields")]
        public List<Field> Fields { get; set; } = new();           // Alle velden
    }
}
