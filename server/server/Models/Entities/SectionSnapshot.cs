// File: Models/Entities/SectionSnapshot.cs

using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace server.Models.Entities
{
    public class SectionSnapshot
    {
        [BsonElement("id")]
        public string Id { get; set; } = null!;

        [BsonElement("naam")]
        public string Naam { get; set; } = null!;

        [BsonElement("components")]
        public List<ComponentSnapshot> Components { get; set; } = new();
    }
}
