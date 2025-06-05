// File: server/Models/LiveSession.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace server.Models
{
    [BsonIgnoreExtraElements]
    public class LiveSession
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("groep")]
        public string Groep { get; set; } = null!;

        [BsonElement("tourId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string TourId { get; set; } = null!;

        [BsonElement("startDate")]
        public DateTime StartDate { get; set; }

        [BsonElement("isActive")]
        public bool IsActive { get; set; }

        [BsonElement("creatorId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CreatorId { get; set; } = null!;
    }
}
