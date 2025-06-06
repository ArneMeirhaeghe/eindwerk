// File: Models/Entities/Tour.cs

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models.Entities
{
    [BsonIgnoreExtraElements]
    public class Tour
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("naamLocatie")]
        public string NaamLocatie { get; set; } = null!;

        [BsonElement("verhuurderId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string VerhuurderId { get; set; } = null!;

        [BsonElement("fases")]
        public Fases Fases { get; set; } = new Fases();
    }
}
