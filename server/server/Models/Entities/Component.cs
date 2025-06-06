// File: Models/Entities/Component.cs

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models.Entities
{
    [BsonIgnoreExtraElements]
    public class Component
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [BsonElement("type")]
        public string Type { get; set; } = null!;

        [BsonElement("props")]
        public BsonDocument Props { get; set; } = new BsonDocument();
    }
}
