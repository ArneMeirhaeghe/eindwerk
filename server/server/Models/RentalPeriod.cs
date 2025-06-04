// File: Models/RentalPeriod.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace server.Models
{
    public class RentalPeriod
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!; // Unieke identifier

        [BsonElement("groep")]
        public string Groep { get; set; } = null!; // Naam van de groep

        [BsonElement("verantwoordelijke")]
        public Contact Verantwoordelijke { get; set; } = null!; // Contactgegevens

        [BsonElement("aankomst")]
        public DateTime Aankomst { get; set; } // Aankomstdatum

        [BsonElement("vertrek")]
        public DateTime Vertrek { get; set; } // Vertrekdatum

        [BsonElement("tourId")]
        public string? TourId { get; set; } // Gekoppelde tour (optioneel)
    }

    public class Contact
    {
        [BsonElement("naam")]
        public string Naam { get; set; } = null!;

        [BsonElement("tel")]
        public string Tel { get; set; } = null!;

        [BsonElement("mail")]
        public string Mail { get; set; } = null!;
    }
}
