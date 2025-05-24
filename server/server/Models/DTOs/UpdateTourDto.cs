using MongoDB.Bson;
using System.Collections.Generic;

namespace server.Models
{
    public class UpdateTourDto
    {
        public string NaamLocatie { get; set; }
        public Dictionary<string, List<BsonDocument>> Fases { get; set; }
    }
}
