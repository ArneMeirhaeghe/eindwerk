// File: Controllers/LiveSessionController.cs
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using server.Helpers;
using server.Models.DTOs.LiveSession;
using server.Models.Entities;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/livesession")]
    public class LiveSessionController : ControllerBase
    {
        private readonly ILiveSessionService _liveService;
        private readonly IMediaService _mediaService;
        private readonly IAzureBlobService _blobService;
        private readonly AzureSettings _azureSettings;

        public LiveSessionController(
            ILiveSessionService liveService,
            IMediaService mediaService,
            IAzureBlobService blobService,
            IOptions<AzureSettings> azureOpts)
        {
            _liveService = liveService;
            _mediaService = mediaService;
            _blobService = blobService;
            _azureSettings = azureOpts.Value;
        }

        [HttpPost("start")]
        [Authorize]
        public async Task<IActionResult> Start([FromBody] StartSessionDto dto)
        {
            var creatorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(creatorId))
                return Unauthorized("Geen gebruiker gevonden");

            try
            {
                var session = await _liveService.StartSessionAsync(
                    dto.VerhuurderId,
                    dto.Groep,
                    dto.VerantwoordelijkeNaam,
                    dto.VerantwoordelijkeTel,
                    dto.VerantwoordelijkeMail,
                    dto.Aankomst,
                    dto.Vertrek,
                    dto.TourId,
                    dto.TourName,
                    creatorId,
                    dto.SectionIds
                );
                return CreatedAtAction(nameof(GetById), new { id = session.Id }, session);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] LiveSessionController.Start: {ex}");
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        [HttpGet("active")]
        [Authorize]
        public async Task<IActionResult> GetActive()
        {
            var creatorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(creatorId))
                return Unauthorized("Geen gebruiker gevonden");

            var sessions = await _liveService.GetActiveSessionsAsync(creatorId);
            return Ok(sessions);
        }

        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var creatorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var sessions = await _liveService.GetAllSessionsAsync(creatorId);
            return Ok(sessions);
        }

        [HttpGet("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id)
        {
            var session = await _liveService.GetByIdAsync(id);
            if (session == null) return NotFound();
            var creatorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (session.CreatorId != creatorId) return Forbid();
            return Ok(session);
        }

        [HttpGet("public/{id:length(24)}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublic(string id)
        {
            var session = await _liveService.GetByIdAsync(id);
            if (session == null || !session.IsActive)
                return NotFound();
            return Ok(session);
        }

        [HttpPatch("{id:length(24)}/end")]
        [Authorize]
        public async Task<IActionResult> EndSession(string id)
        {
            var creatorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            try
            {
                await _liveService.EndSessionAsync(id, creatorId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id:length(24)}/sections/{sectionId}/components/{componentId}")]
        [AllowAnonymous]
        public async Task<IActionResult> SubmitField(
            string id,
            string sectionId,
            string componentId,
            [FromBody] PatchFieldDto dto)
        {
            var value = ConvertJsonElement(dto.Value);
            if (value == null) return BadRequest("Ongeldige waarde.");
            await _liveService.AddOrUpdateResponseAsync(id, sectionId, componentId, value);
            return NoContent();
        }

        [HttpPost("{id:length(24)}/responses/bulk")]
        [AllowAnonymous]
        public async Task<IActionResult> BulkSubmit(string id, [FromBody] BulkResponsesDto dto)
        {
            if (dto?.Responses == null) return BadRequest("Geen responses opgegeven.");
            var converted = new Dictionary<string, Dictionary<string, object>>();
            foreach (var sectionPair in dto.Responses)
            {
                var compDict = new Dictionary<string, object>();
                foreach (var compPair in sectionPair.Value)
                {
                    var v = ConvertJsonElement(compPair.Value);
                    if (v != null) compDict[compPair.Key] = v;
                }
                if (compDict.Count > 0) converted[sectionPair.Key] = compDict;
            }
            await _liveService.UpdateResponsesBulkAsync(id, converted);
            return NoContent();
        }

        [HttpPost("{id:length(24)}/sections/{sectionId}/components/{componentId}/upload")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadResponseFile(
            string id,
            string sectionId,
            string componentId,
            IFormFile file)
        {
            var mediaItem = await _mediaService.UploadFileAsync(file, $"responses/{id}", id);
            var sasUri = _blobService.GetBlobSasUri(
                mediaItem.BlobName, _azureSettings.SasExpiryHours);
            var metadata = new Dictionary<string, object>
            {
                ["url"] = sasUri.ToString(),
                ["fileName"] = mediaItem.FileName,
                ["timestamp"] = mediaItem.Timestamp
            };
            await _liveService.AddOrUpdateResponseAsync(id, sectionId, componentId, metadata);
            return Ok(new { id = mediaItem.Id, url = sasUri });
        }

        // in LiveSessionController.cs, onderaan de class:
        private static object? ConvertJsonElement(object? value)
        {
            if (value is not System.Text.Json.JsonElement je)
                return value;

            return je.ValueKind switch
            {
                System.Text.Json.JsonValueKind.String => je.GetString(),
                System.Text.Json.JsonValueKind.Number => je.GetDouble(),
                System.Text.Json.JsonValueKind.True => true,
                System.Text.Json.JsonValueKind.False => false,
                System.Text.Json.JsonValueKind.Array => je.EnumerateArray()
                                                              .Select(e => ConvertJsonElement(e))
                                                              .Where(v => v is not null)
                                                              .ToList(),
                System.Text.Json.JsonValueKind.Object => je.EnumerateObject()
                                                              .ToDictionary(p => p.Name, p => ConvertJsonElement(p.Value)!),
                _ => je.GetRawText()
            };
        }
    }
}