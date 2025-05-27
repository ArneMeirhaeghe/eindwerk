using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using server.Helpers;
using server.Models;
using server.Services;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MediaController : ControllerBase
    {
        private readonly IAzureBlobService _blobSvc;
        private readonly IMediaService _mediaSvc;
        private readonly AzureSettings _azureCfg;

        public MediaController(
            IAzureBlobService blobSvc,
            IMediaService mediaSvc,
            IOptions<AzureSettings> azureOptions)
        {
            _blobSvc = blobSvc;
            _mediaSvc = mediaSvc;
            _azureCfg = azureOptions.Value;
        }

        [HttpPost("upload")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> Upload(
            IFormFile file,
            [FromForm] string? alt,
            [FromForm] string? styles)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Geen bestand geüpload");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var blobName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            await using var stream = file.OpenReadStream();
            await _blobSvc.UploadBlobAsync(stream, file.ContentType, blobName);

            var media = new MediaItem
            {
                FileName = file.FileName,
                ContentType = file.ContentType,
                Alt = string.IsNullOrEmpty(alt) ? file.FileName : alt,
                Styles = styles ?? "",
                UserId = userId,
                Timestamp = DateTime.UtcNow,
                BlobName = blobName
            };

            await _mediaSvc.CreateAsync(media);

            return Ok(new
            {
                id = media.Id.ToString(),
                filename = media.FileName,
                contentType = media.ContentType,
                alt = media.Alt,
                styles = media.Styles,
                timestamp = media.Timestamp
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var list = await _mediaSvc.GetByUserAsync(userId);
            var dto = list.Select(i => new {
                id = i.Id.ToString(),
                filename = i.FileName,
                contentType = i.ContentType,
                alt = i.Alt,
                styles = i.Styles,
                timestamp = i.Timestamp,
                url = _blobSvc.GetBlobSasUri(i.BlobName, _azureCfg.SasExpiryHours).ToString()
            });
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var item = await _mediaSvc.GetByIdAsync(id);
            if (item == null || item.UserId != userId)
                return NotFound();

            return Ok(new
            {
                id = item.Id.ToString(),
                filename = item.FileName,
                contentType = item.ContentType,
                alt = item.Alt,
                styles = item.Styles,
                timestamp = item.Timestamp,
                url = _blobSvc.GetBlobSasUri(item.BlobName, _azureCfg.SasExpiryHours).ToString()
            });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var item = await _mediaSvc.GetByIdAsync(id);
            if (item == null || item.UserId != userId)
                return NotFound();

            // 1) Verwijder blob
            await _blobSvc.DeleteBlobAsync(item.BlobName);
            // 2) Verwijder metadata
            var ok = await _mediaSvc.DeleteAsync(id);
            if (!ok)
                return StatusCode(500, "Kon metadata niet verwijderen");

            return NoContent();
        }

    }
}
