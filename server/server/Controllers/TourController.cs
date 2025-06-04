// File: server/Controllers/ToursController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Alleen ingelogde verhuurders mogen tours beheren
    public class ToursController : ControllerBase
    {
        private readonly IMongoCollection<BsonDocument> _tours;

        public ToursController(IMongoClient client, IConfiguration config)
        {
            var db = client.GetDatabase(config["MongoSettings:Database"]);
            _tours = db.GetCollection<BsonDocument>("tours");
        }

        // GET api/Tours
        [HttpGet]
        public async Task<IActionResult> GetTours()
        {
            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var filter = Builders<BsonDocument>.Filter.Eq("verhuurderId", verhuurderId);

            var docs = await _tours
                .Find(filter)
                .Project(Builders<BsonDocument>.Projection
                    .Include("_id")
                    .Include("naamLocatie"))
                .ToListAsync();

            var list = docs.Select(d => new
            {
                id = d["_id"].AsObjectId.ToString(),
                naamLocatie = d["naamLocatie"].AsString
            });

            return Ok(list);
        }

        // GET api/Tours/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTourById(string id)
        {
            if (!ObjectId.TryParse(id, out var objId))
                return BadRequest("Ongeldig ID");

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var filter = Builders<BsonDocument>.Filter.Eq("_id", objId)
                       & Builders<BsonDocument>.Filter.Eq("verhuurderId", verhuurderId);

            var doc = await _tours.Find(filter).FirstOrDefaultAsync();
            if (doc == null) return NotFound();

            // Verwijder verhuurderId en _id, voeg id toe
            doc.Remove("verhuurderId");
            var oid = doc["_id"].AsObjectId.ToString();
            doc.Remove("_id");
            doc["id"] = oid;

            var result = (Dictionary<string, object>)BsonTypeMapper.MapToDotNetValue(doc);
            return Ok(result);
        }

        // POST api/Tours
        [HttpPost]
        public async Task<IActionResult> CreateTour([FromBody] CreateTourDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NaamLocatie))
                return BadRequest("NaamLocatie is verplicht");

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var doc = new BsonDocument
            {
                { "naamLocatie", dto.NaamLocatie },
                { "verhuurderId", verhuurderId },
                { "fases", new BsonDocument {
                    { "voor", new BsonArray() },
                    { "aankomst", new BsonArray() },
                    { "terwijl", new BsonArray() },
                    { "vertrek", new BsonArray() },
                    { "na", new BsonArray() }
                }}
            };

            await _tours.InsertOneAsync(doc);

            // Cleanup voor response
            doc.Remove("verhuurderId");
            var oid = doc["_id"].AsObjectId.ToString();
            doc.Remove("_id");
            doc["id"] = oid;

            var result = (Dictionary<string, object>)BsonTypeMapper.MapToDotNetValue(doc);
            return Ok(result);
        }

        // PUT api/Tours/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTour(string id, [FromBody] JsonElement body)
        {
            if (!ObjectId.TryParse(id, out var objId))
                return BadRequest("Ongeldig ID");

            BsonDocument data;
            try
            {
                data = BsonDocument.Parse(body.GetRawText());
            }
            catch (JsonException ex)
            {
                return BadRequest("Ongeldige JSON: " + ex.Message);
            }

            if (!data.Contains("naamLocatie") || data["naamLocatie"].AsString == "")
                return BadRequest("NaamLocatie is verplicht");

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            data["_id"] = objId;
            data["verhuurderId"] = verhuurderId;

            var filter = Builders<BsonDocument>.Filter.Eq("_id", objId)
                       & Builders<BsonDocument>.Filter.Eq("verhuurderId", verhuurderId);

            var res = await _tours.ReplaceOneAsync(filter, data);
            if (res.MatchedCount == 0) return NotFound();

            data.Remove("verhuurderId");
            data.Remove("_id");
            data["id"] = objId.ToString();
            var result = (Dictionary<string, object>)BsonTypeMapper.MapToDotNetValue(data);

            return Ok(result);
        }

        // DELETE api/Tours/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(string id)
        {
            if (!ObjectId.TryParse(id, out var objId))
                return BadRequest("Ongeldig ID");

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var filter = Builders<BsonDocument>.Filter.Eq("_id", objId)
                       & Builders<BsonDocument>.Filter.Eq("verhuurderId", verhuurderId);

            var del = await _tours.DeleteOneAsync(filter);
            if (del.DeletedCount == 0) return NotFound();

            return Ok();
        }
    }

    public class CreateTourDto
    {
        public string NaamLocatie { get; set; } = null!;
    }
}
