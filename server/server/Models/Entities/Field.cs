// File: server/Models/Entities/Field.cs
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace server.Models.Entities
{
    public class Field
    {
        [BsonElement("id")]
        public string Id { get; set; } = null!;                     // Unieke veld‐ID

        [BsonElement("type")]
        public string Type { get; set; } = null!;                   // bv. "text", "dropdown"

        [BsonElement("label")]
        public string Label { get; set; } = null!;                  // Label in formulier

        [BsonElement("settings")]
        public Dictionary<string, object> Settings { get; set; } = new(); // Extra opties

        [BsonElement("order")]
        public int Order { get; set; }                              // Positie in form
    }
}
