// Backend/Controllers/UploadsController.cs
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System.Linq;

namespace server.Controllers
{
    [Route("api/uploads")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly GridFSBucket _gridFs;

        public UploadsController(IMongoClient client, IConfiguration config)
        {
            var db = client.GetDatabase(config["MongoSettings:Database"]);
            _gridFs = new GridFSBucket(db);
        }

        // POST api/uploads
        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        {
            var form = Request.Form;
            var file = form.Files.FirstOrDefault();
            if (file == null || file.Length == 0)
                return BadRequest("Geen bestand geüpload.");

            // Haal metadata-velden uit form-data
            var type = form["type"].ToString();
            var alt = form["alt"].ToString();
            var styles = form["styles"].ToString();

            var metadata = new BsonDocument
            {
                { "type", type },
                { "alt", alt },
                { "styles", styles },
                { "contentType", file.ContentType }
            };

            // Upload naar GridFS met metadata
            var options = new GridFSUploadOptions { Metadata = metadata };
            await _gridFs.UploadFromStreamAsync(file.FileName, file.OpenReadStream(), options);

            return Ok();
        }

        // GET api/uploads
        [HttpGet]
        public async Task<IActionResult> GetUploads()
        {
            var files = await _gridFs.Find(Builders<GridFSFileInfo>.Filter.Empty).ToListAsync();
            var result = files.Select(f => {
                var m = f.Metadata ?? new BsonDocument();
                return new
                {
                    id = f.Id.ToString(),
                    filename = f.Filename,
                    contentType = m.GetValue("contentType", "").AsString,
                    type = m.GetValue("type", "").AsString,
                    alt = m.GetValue("alt", "").AsString,
                    styles = m.GetValue("styles", "").AsString
                };
            });
            return Ok(result);
        }

        // GET api/uploads/{id}
        [HttpGet("{id:length(24)}")]
        public async Task<IActionResult> Download(string id)
        {
            var oid = ObjectId.Parse(id);
            var bytes = await _gridFs.DownloadAsBytesAsync(oid);
            var info = await _gridFs.Find(Builders<GridFSFileInfo>.Filter.Eq(x => x.Id, oid)).FirstOrDefaultAsync();
            var ct = info.Metadata?.GetValue("contentType", "application/octet-stream").AsString;
            return File(bytes, ct, info.Filename);
        }
    }
}
