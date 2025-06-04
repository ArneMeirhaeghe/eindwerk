using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace server.Models
{
    // BsonIgnoreExtraElements zorgt ervoor dat een oud veld 'tourId' genegeerd wordt
    [BsonIgnoreExtraElements]
    public class LiveSession
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("groep")]
        public string Groep { get; set; } = null!;

        // Tour is nullable, zodat bestaande oude records zonder embedded tour niet crashen
        [BsonElement("tour")]
        public Tour? Tour { get; set; }

        [BsonElement("startDate")]
        public DateTime StartDate { get; set; }

        [BsonElement("isActive")]
        public bool IsActive { get; set; }
    }
}
