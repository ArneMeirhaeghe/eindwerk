// File: Models/Entities/Section.cs

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace server.Models.Entities
{
    [BsonIgnoreExtraElements]
    public class Section
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [BsonElement("naam")]
        public string Naam { get; set; } = null!;

        [BsonElement("components")]
        public List<Component> Components { get; set; } = new List<Component>();
    }
}
