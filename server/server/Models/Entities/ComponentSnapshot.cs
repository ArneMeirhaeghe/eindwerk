// File: Models/Entities/ComponentSnapshot.cs

using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace server.Models.Entities
{
    public class ComponentSnapshot
    {
        [BsonElement("id")]
        public string Id { get; set; } = null!;

        [BsonElement("type")]
        public string Type { get; set; } = null!;

        [BsonElement("props")]
        public Dictionary<string, object> Props { get; set; } = new();
    }
}
