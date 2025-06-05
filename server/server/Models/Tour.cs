// File: server/Models/Tour.cs

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

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

        // Verwijder [BsonIgnore] zodat we dit wél inlezen uit de database:
        [BsonElement("verhuurderId")]
        public string VerhuurderId { get; set; } = null!;

        [BsonElement("fases")]
        public Fases Fases { get; set; } = new Fases();
    }

    public class Fases
    {
        [BsonElement("voor")]
        public List<Section> Voor { get; set; } = new List<Section>();

        [BsonElement("aankomst")]
        public List<Section> Aankomst { get; set; } = new List<Section>();

        [BsonElement("terwijl")]
        public List<Section> Terwijl { get; set; } = new List<Section>();

        [BsonElement("vertrek")]
        public List<Section> Vertrek { get; set; } = new List<Section>();

        [BsonElement("na")]
        public List<Section> Na { get; set; } = new List<Section>();
    }

    public class Section
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = System.Guid.NewGuid().ToString();

        [BsonElement("naam")]
        public string Naam { get; set; } = null!;

        [BsonElement("components")]
        public List<Component> Components { get; set; } = new List<Component>();
    }

    public class Component
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = System.Guid.NewGuid().ToString();

        [BsonElement("type")]
        public string Type { get; set; } = null!;

        [BsonElement("props")]
        public BsonDocument Props { get; set; } = new BsonDocument();
    }
}
