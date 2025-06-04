// File: Models/Tour.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace server.Models
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
        [JsonIgnore]
        public string VerhuurderId { get; set; } = null!;

        // Dictionary met raw BsonDocument‐lijsten (voor elke fase)
        [BsonElement("fases")]
        public Dictionary<string, List<BsonDocument>> Fases { get; set; } = null!;
    }
}
