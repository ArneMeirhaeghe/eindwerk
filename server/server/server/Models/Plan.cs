using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using server.Models;

public class Plan
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string OwnerId { get; set; } = ""; // = userId
    public string Title { get; set; } = "";
    public List<Block> Blocks { get; set; } = new();
    public string PublicId { get; set; } = ""; // bv. "abc123"

}
