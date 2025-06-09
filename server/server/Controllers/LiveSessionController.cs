// File: Controllers/LiveSessionController.cs

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs.LiveSession;
using server.Services.Implementations;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LiveSessionController : ControllerBase
    {
        private readonly ILiveSessionService _liveService;
        private readonly IMediaService _mediaService;
        public LiveSessionController(
            ILiveSessionService liveService,
            IMediaService mediaService)
        {
            _liveService = liveService;
            _mediaService = mediaService;
        }

        [HttpPost("start")]
        [Authorize]
        public async Task<IActionResult> Start([FromBody] StartSessionDto dto)
        {
            var creatorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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
            catch (InvalidOperationException ioe)
            {
                return BadRequest(new { message = ioe.Message });
            }
            catch (KeyNotFoundException knf)
            {
                return BadRequest(new { message = knf.Message });
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
            var creatorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(creatorId))
                return Unauthorized("Geen gebruiker gevonden");

            try
            {
                var sessions = await _liveService.GetActiveSessionsAsync(creatorId);
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] LiveSessionController.GetActive: {ex}");
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        [HttpGet("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id)
        {
            var session = await _liveService.GetByIdAsync(id);
            if (session == null)
                return NotFound();

            var creatorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (creatorId == null || session.CreatorId != creatorId)
                return Forbid();

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
            var creatorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(creatorId))
                return Unauthorized("Geen gebruiker gevonden");

            try
            {
                await _liveService.EndSessionAsync(id, creatorId);
                return NoContent();
            }
            catch (KeyNotFoundException knf)
            {
                return BadRequest(new { message = knf.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] LiveSessionController.EndSession: {ex}");
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        //// Upload-endpoint voor bestanden (image/video/file)
        //[HttpPost("{id:length(24)}/components/{fieldId}/upload")]
        //[AllowAnonymous]
        //public async Task<IActionResult> UploadFile(string id, string fieldId, IFormFile file)
        //{
        //    if (file == null || file.Length == 0)
        //        return BadRequest("Geen bestand geüpload.");

        //    var folder = $"livesession/{id}";
        //    var mediaItem = await _mediaService.UploadFileAsync(file, folder);

        //    var metadata = new
        //    {
        //        url = mediaItem.Url,
        //        fileName = mediaItem.FileName,
        //        uploadedAt = mediaItem.Timestamp
        //    };

        //    await _liveService.AddOrUpdateResponseAsync(id, fieldId, metadata);
        //    return Ok(metadata);
        //}

        // PATCH-endpoint voor formulier-waarden
        [AllowAnonymous]
        [HttpPatch("{id:length(24)}/sections/{sectionId}/components/{componentId}")]
        public async Task<IActionResult> SubmitField(
            string id,
            string sectionId,
            string componentId,
            [FromBody] PatchFieldDto dto)
        {
            if (dto == null)
                return BadRequest("Geen payload.");

            var value = ConvertJsonElement(dto.Value);
            if (value == null)
                return BadRequest("Ongeldige waarde.");

            await _liveService.AddOrUpdateResponseAsync(id, sectionId, componentId, value);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("{id:length(24)}/responses/bulk")]
        public async Task<IActionResult> BulkSubmit(
            string id,
            [FromBody] BulkResponsesDto dto)
        {
            if (dto == null || dto.Responses == null)
                return BadRequest("Geen responses opgegeven.");

            // Converteer alle JsonElement-waarden naar .NET types
            var converted = new Dictionary<string, Dictionary<string, object>>();
            foreach (var sectionPair in dto.Responses)
            {
                var compDict = new Dictionary<string, object>();
                foreach (var compPair in sectionPair.Value)
                {
                    var v = ConvertJsonElement(compPair.Value);
                    if (v != null)
                        compDict[compPair.Key] = v;
                }
                if (compDict.Count > 0)
                    converted[sectionPair.Key] = compDict;
            }

            await _liveService.UpdateResponsesBulkAsync(id, converted);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("{id:length(24)}/sections/{sectionId}/components/{componentId}/upload")]
        public async Task<IActionResult> UploadResponseFile(
            string id,
            string sectionId,
            string componentId,
            IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Geen bestand geüpload.");

            var mediaItem = await _mediaService.UploadFileAsync(file, $"responses/{id}");
            await _liveService.AddOrUpdateResponseAsync(id, sectionId, componentId, mediaItem);
            return Ok(mediaItem);
        }

        // Helper: converteert System.Text.Json.JsonElement naar een .NET type
        private static object? ConvertJsonElement(object? value)
        {
            if (value is JsonElement je)
            {
                return je.ValueKind switch
                {
                    JsonValueKind.String => je.GetString(),
                    JsonValueKind.Number => je.TryGetInt64(out var l) ? (object)l : je.GetDouble(),
                    JsonValueKind.True => true,
                    JsonValueKind.False => false,
                    JsonValueKind.Null => null,
                    JsonValueKind.Array => ConvertJsonArray(je),
                    JsonValueKind.Object => ConvertJsonObject(je),
                    _ => je.GetRawText()
                };
            }
            return value;
        }
        private static List<object?> ConvertJsonArray(JsonElement array)
        {
            var list = new List<object?>();
            foreach (var item in array.EnumerateArray())
            {
                list.Add(ConvertJsonElement(item));
            }
            return list;
        }

        private static Dictionary<string, object?> ConvertJsonObject(JsonElement obj)
        {
            var dict = new Dictionary<string, object?>();
            foreach (var prop in obj.EnumerateObject())
            {
                dict[prop.Name] = ConvertJsonElement(prop.Value);
            }
            return dict;
        }
    }
}