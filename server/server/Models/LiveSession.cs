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

        // TourId is een string, maar intern een ObjectId
        [BsonElement("tourId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string TourId { get; set; } = null!;

        [BsonElement("startDate")]
        public DateTime StartDate { get; set; }

        [BsonElement("isActive")]
        public bool IsActive { get; set; }

        // CreatorId is de User.Id (ObjectId as string)
        [BsonElement("creatorId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CreatorId { get; set; } = null!;
    }
}
