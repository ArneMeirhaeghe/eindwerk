using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace server.Models
{
    [BsonIgnoreExtraElements]
    public class MediaItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("fileName")]
        public string FileName { get; set; } = null!;

        [BsonElement("contentType")]
        public string ContentType { get; set; } = null!;

        [BsonElement("alt")]
        public string Alt { get; set; } = null!;

        [BsonElement("styles")]
        public string Styles { get; set; } = null!;

        [BsonElement("userId")]
        public string UserId { get; set; } = null!;

        [BsonElement("timestamp")]
        public DateTime Timestamp { get; set; }

        [BsonElement("blobName")]
        public string BlobName { get; set; } = null!;
    }
}
