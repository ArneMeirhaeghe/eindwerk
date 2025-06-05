//// File: server/Models/ComponentSnapshot.cs
//using MongoDB.Bson;
//using MongoDB.Bson.Serialization.Attributes;
//using System.Collections.Generic;

//namespace server.Models
//{
//    public class ComponentSnapshot
//    {
//        [BsonElement("id")]
//        [BsonRepresentation(BsonType.ObjectId)]
//        public string Id { get; set; } = null!;

//        [BsonElement("type")]
//        public string Type { get; set; } = null!;

//        [BsonElement("props")]
//        public Dictionary<string, object> Props { get; set; } = new();
//    }
//}
