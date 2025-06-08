// File: /mnt/data/LiveSession.cs

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace server.Models.Entities
{
    [BsonIgnoreExtraElements]
    public class LiveSession
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("verhuurderId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string VerhuurderId { get; set; } = null!;

        [BsonElement("groep")]
        public string Groep { get; set; } = null!;

        [BsonElement("verantwoordelijkeNaam")]
        public string VerantwoordelijkeNaam { get; set; } = null!;

        [BsonElement("verantwoordelijkeTel")]
        public string VerantwoordelijkeTel { get; set; } = null!;

        [BsonElement("verantwoordelijkeMail")]
        public string VerantwoordelijkeMail { get; set; } = null!;

        [BsonElement("aankomst")]
        public DateTime Aankomst { get; set; }

        [BsonElement("vertrek")]
        public DateTime Vertrek { get; set; }

        [BsonElement("tourId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string TourId { get; set; } = null!;

        [BsonElement("tourName")]
        public string TourName { get; set; } = null!;

        [BsonElement("startDate")]
        public DateTime StartDate { get; set; }

        [BsonElement("isActive")]
        public bool IsActive { get; set; }

        [BsonElement("creatorId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CreatorId { get; set; } = null!;

        [BsonElement("fases")]
        public Dictionary<string, List<SectionSnapshot>> Fases { get; set; } = new();

        [BsonElement("responses")]
        public Dictionary<string, Dictionary<string, object>> Responses { get; set; } = new();
    }
}
