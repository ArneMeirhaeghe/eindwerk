// Models/RentalPeriod.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace server.Models
{
    public class RentalPeriod
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Groep { get; set; }
        public string TourId { get; set; }
        public DateTime Aankomst { get; set; }
        public DateTime Vertrek { get; set; }
    }
}
