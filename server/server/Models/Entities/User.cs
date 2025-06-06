// File: Models/Entities/User.cs

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models.Entities
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("email")]
        public string Email { get; set; } = null!;

        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = null!;

        [BsonElement("role")]
        public string Role { get; set; } = "User";

        [BsonElement("isEmailVerified")]
        public bool IsEmailVerified { get; set; } = false;
    }
}
