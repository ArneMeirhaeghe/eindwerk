// File: Controllers/FilesController.cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver.GridFS;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using MongoDB.Driver;

namespace server.Controllers
{
    public class AppSettings
    {
        public string DefaultStyles { get; set; } = "";
        public string DefaultAltFormat { get; set; } = "{0}";
    }

    [ApiController]
    [Route("api/files")]
    public class FilesController : ControllerBase
    {
        private readonly GridFSBucket _bucket;
        private readonly AppSettings _settings;

        public FilesController(GridFSBucket bucket, IOptions<AppSettings> settings)
        {
            _bucket = bucket;
            _settings = settings.Value;
        }

        [HttpPost("upload")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> Upload(
            IFormFile file,
            [FromForm] string? type = null,
            [FromForm] string? alt = null,
            [FromForm] string? styles = null)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Geen bestand geüpload");

            var fileType = !string.IsNullOrWhiteSpace(type)
                ? type
                : file.ContentType.StartsWith("image/") ? "image"
                : file.ContentType.StartsWith("video/") ? "video"
                : "file";

            var altText = !string.IsNullOrWhiteSpace(alt)
                ? alt
                : string.Format(_settings.DefaultAltFormat, file.FileName);

            var stylesText = !string.IsNullOrWhiteSpace(styles)
                ? styles
                : _settings.DefaultStyles;

            var metadata = new BsonDocument
            {
                { "ContentType", file.ContentType },
                { "Type", fileType },
                { "Alt", altText },
                { "Styles", stylesText }
            };

            await using var stream = file.OpenReadStream();
            var objectId = await _bucket.UploadFromStreamAsync(
                file.FileName,
                stream,
                new GridFSUploadOptions { Metadata = metadata }
            );

            return Ok(new
            {
                id = objectId.ToString(),
                filename = file.FileName,
                contentType = file.ContentType,
                type = fileType,
                alt = altText,
                styles = stylesText
            });
        }

        [HttpGet]
        public async Task<IActionResult> List()
        {
            var cursor = await _bucket.FindAsync(Builders<GridFSFileInfo>.Filter.Empty);
            var files = await cursor.ToListAsync();
            var dto = files.Select(f =>
            {
                var md = f.Metadata;
                var typeValue = md?.GetValue("Type").AsString ?? (f.Filename.EndsWith(".mp4") ? "video" : "image");
                var altValue = md?.GetValue("Alt").AsString ?? string.Format(_settings.DefaultAltFormat, f.Filename);
                var stylesValue = md?.GetValue("Styles").AsString ?? _settings.DefaultStyles;
                return new
                {
                    id = f.Id.ToString(),
                    filename = f.Filename,
                    contentType = md.GetValue("ContentType").AsString,
                    type = typeValue,
                    alt = altValue,
                    styles = stylesValue
                };
            });
            return Ok(dto);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<IActionResult> Download(string id)
        {
            if (!ObjectId.TryParse(id, out var objId))
                return BadRequest("Ongeldig ID");

            using var cursor = await _bucket.FindAsync(Builders<GridFSFileInfo>.Filter.Eq("_id", objId));
            var info = await cursor.FirstOrDefaultAsync();
            if (info == null) return NotFound();

            Response.ContentType = info.Metadata.GetValue("ContentType").AsString;
            await _bucket.DownloadToStreamAsync(objId, Response.Body);
            return new EmptyResult();
        }
    }
}
