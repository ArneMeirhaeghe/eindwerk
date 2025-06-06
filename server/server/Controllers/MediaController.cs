// File: Controllers/MediaController.cs

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using server.Helpers;                       // AzureSettings
using server.Models.Entities;               // MediaItem
using server.Services.Interfaces;           // IAzureBlobService, IMediaService

namespace server.Controllers
{
    [ApiController]
    [Route("api/media")]
    public class MediaController : ControllerBase
    {
        private readonly IAzureBlobService _blobSvc;
        private readonly IMediaService _mediaSvc;
        private readonly AzureSettings _azureSettings;

        public MediaController(
            IAzureBlobService blobSvc,
            IMediaService mediaSvc,
            IOptions<AzureSettings> azureOptions)
        {
            _blobSvc = blobSvc;
            _mediaSvc = mediaSvc;
            _azureSettings = azureOptions.Value;
        }

        // POST api/media/upload
        [HttpPost("upload")]
        [DisableRequestSizeLimit]
        [Authorize]
        public async Task<IActionResult> Upload(
            IFormFile file,
            [FromForm] string? alt,
            [FromForm] string? styles,
            [FromForm] string? type)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Geen bestand geüpload");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var folder = type switch
            {
                "img" => "img",
                "video" => "video",
                _ => "files"
            };

            var blobName = $"{folder}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            await using (var stream = file.OpenReadStream())
            {
                await _blobSvc.UploadBlobAsync(stream, file.ContentType, blobName);
            }

            var media = new MediaItem
            {
                BlobName = blobName,
                FileName = file.FileName,
                ContentType = file.ContentType,
                Alt = string.IsNullOrEmpty(alt) ? file.FileName : alt,
                Styles = string.IsNullOrEmpty(styles) ? "" : styles,
                UserId = userId,
                Timestamp = DateTime.UtcNow
            };
            await _mediaSvc.CreateAsync(media);

            var dto = new
            {
                id = media.Id,
                filename = media.FileName,
                contentType = media.ContentType,
                alt = media.Alt,
                styles = media.Styles,
                timestamp = media.Timestamp,
                url = _blobSvc.GetBlobSasUri(media.BlobName, _azureSettings.SasExpiryHours).ToString()
            };
            return Ok(dto);
        }

        // GET api/media
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> List()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var items = await _mediaSvc.GetByUserAsync(userId);
            var dto = items
                .OrderByDescending(x => x.Timestamp)
                .Select(x => new
                {
                    id = x.Id,
                    filename = x.FileName,
                    contentType = x.ContentType,
                    alt = x.Alt,
                    styles = x.Styles,
                    timestamp = x.Timestamp,
                    url = _blobSvc.GetBlobSasUri(x.BlobName, _azureSettings.SasExpiryHours).ToString()
                });
            return Ok(dto);
        }

        // DELETE api/media/{id}
        [HttpDelete("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var mediaItem = await _mediaSvc.GetByIdAsync(id);
            if (mediaItem == null || mediaItem.UserId != userId)
                return NotFound();

            await _blobSvc.DeleteBlobAsync(mediaItem.BlobName);
            var removed = await _mediaSvc.DeleteAsync(id);
            if (!removed)
                return StatusCode(StatusCodes.Status500InternalServerError, "Verwijderen mislukt");

            return NoContent();
        }
    }
}
