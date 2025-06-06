// File: Models/Entities/MediaItem.cs

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace server.Models.Entities
{
    [BsonIgnoreExtraElements]
    public class MediaItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("blobName")]
        public string BlobName { get; set; } = null!;

        [BsonElement("fileName")]
        public string FileName { get; set; } = null!;

        [BsonElement("contentType")]
        public string ContentType { get; set; } = null!;

        [BsonElement("alt")]
        public string Alt { get; set; } = null!;

        [BsonElement("styles")]
        public string Styles { get; set; } = null!;

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        [BsonElement("timestamp")]
        public DateTime Timestamp { get; set; }

        // Voeg Url toe zodat controllers mediaItem.Url kunnen gebruiken
        [BsonElement("url")]
        public string Url { get; set; } = null!;
    }
}
