// File: server/Controllers/LiveSessionController.cs
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LiveSessionController : ControllerBase
    {
        private readonly LiveSessionService _liveService;

        public LiveSessionController(LiveSessionService liveService)
        {
            _liveService = liveService;
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

        public class StartSessionDto
        {
            public string VerhuurderId { get; set; } = null!;
            public string Groep { get; set; } = null!;
            public string VerantwoordelijkeNaam { get; set; } = null!;
            public string VerantwoordelijkeTel { get; set; } = null!;
            public string VerantwoordelijkeMail { get; set; } = null!;
            public DateTime Aankomst { get; set; }
            public DateTime Vertrek { get; set; }
            public string TourId { get; set; } = null!;
            public string TourName { get; set; } = null!;
            public List<string> SectionIds { get; set; } = new();
        }
    }
}
