// File: Models/Entities/Fases.cs

using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using static System.Collections.Specialized.BitVector32;

namespace server.Models.Entities
{
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
}
