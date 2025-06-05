// File: server/Models/LiveSession.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace server.Models
{
    [BsonIgnoreExtraElements]
    public class LiveSession
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        // Gegevens uit de fake API:
        [BsonElement("verhuurderId")]
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

        // Tour‐gegevens:
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

        // Gekozen secties met componenten, gegroepeerd per fase:
        [BsonElement("fases")]
        public Dictionary<string, List<SectionSnapshot>> Fases { get; set; } = new();
    }

    // In dezelfde file: SectionSnapshot en ComponentSnapshot
    public class SectionSnapshot
    {
        [BsonElement("id")]
        public string Id { get; set; } = null!;   // Verwijder [BsonRepresentation(ObjectId)] omdat de id kan zijn: GUID of 24-hex

        [BsonElement("naam")]
        public string Naam { get; set; } = null!;

        [BsonElement("components")]
        public List<ComponentSnapshot> Components { get; set; } = new();
    }

    public class ComponentSnapshot
    {
        [BsonElement("id")]
        public string Id { get; set; } = null!;   // Verwijder [BsonRepresentation(ObjectId)]

        [BsonElement("type")]
        public string Type { get; set; } = null!;

        [BsonElement("props")]
        public Dictionary<string, object> Props { get; set; } = new();
    }
}
