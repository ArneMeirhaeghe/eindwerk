// Models/LiveSession.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace server.Models
{
    public class LiveSession
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Groep { get; set; }
        public string TourId { get; set; }
        public DateTime StartDate { get; set; }
        public bool IsActive { get; set; }
    }
}
