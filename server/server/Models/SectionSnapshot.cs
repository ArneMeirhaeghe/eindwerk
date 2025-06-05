//// File: server/Models/SectionSnapshot.cs
//using MongoDB.Bson;
//using MongoDB.Bson.Serialization.Attributes;
//using System.Collections.Generic;

//namespace server.Models
//{
//    public class SectionSnapshot
//    {
//        [BsonElement("id")]
//        [BsonRepresentation(BsonType.ObjectId)]
//        public string Id { get; set; } = null!;

//        [BsonElement("naam")]
//        public string Naam { get; set; } = null!;

//        [BsonElement("components")]
//        public List<ComponentSnapshot> Components { get; set; } = new();
//    }
//}
