using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace server.Models
{
    public class MediaItem
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("FileName")]
        public string FileName { get; set; } = null!;

        [BsonElement("ContentType")]
        public string ContentType { get; set; } = null!;

        [BsonElement("Alt")]
        public string Alt { get; set; } = null!;

        [BsonElement("Styles")]
        public string Styles { get; set; } = null!;

        [BsonElement("UserId")]
        public string UserId { get; set; } = null!;

        [BsonElement("Timestamp")]
        public DateTime Timestamp { get; set; }

        [BsonElement("BlobName")]
        public string BlobName { get; set; } = null!;
    }
}
