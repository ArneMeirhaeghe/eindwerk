using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver.GridFS;
using MongoDB.Bson;
using MongoDB.Driver;

namespace server.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly GridFSBucket _bucket;
        public FileUploadController(IMongoClient client, IConfiguration config)
        {
            var dbName = config.GetSection("MongoSettings:Database").Value;
            var db = client.GetDatabase(dbName);
            _bucket = new GridFSBucket(db);
        }

        [HttpPost("upload")]
        [DisableRequestSizeLimit] // voor grote bestanden
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Geen bestand geüpload");

            using var stream = file.OpenReadStream();
            var objectId = await _bucket.UploadFromStreamAsync(
                file.FileName, stream, new GridFSUploadOptions
                {
                    Metadata = new BsonDocument
                    {
                        ["ContentType"] = file.ContentType
                    }
                });

            // retourneer de id zodat frontend die kan opslaan
            return Ok(new { id = objectId.ToString() });
        }

        [HttpGet("{id:length(24)}")]
        public async Task<IActionResult> Download(string id)
        {
            var bytes = await _bucket.DownloadAsBytesAsync(ObjectId.Parse(id));
            // optioneel content-type uit metadata halen:
            return File(bytes, "application/octet-stream");
        }
    }
}
