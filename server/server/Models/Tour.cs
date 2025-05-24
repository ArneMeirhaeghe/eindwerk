using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace server.Models
{
    public class Tour
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("naamLocatie")]
        public string NaamLocatie { get; set; }

        [BsonElement("verhuurderId")]
        [JsonIgnore]
        public string VerhuurderId { get; set; }

        [BsonElement("fases")]
        public Dictionary<string, List<BsonDocument>> Fases { get; set; }
    }
}
