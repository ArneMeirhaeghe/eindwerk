// File: server/Controllers/LiveSessionController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using MongoDB.Bson;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LiveSessionController : ControllerBase
    {
        private readonly LiveSessionService _liveService;
        private readonly TourService _tourService;

        public LiveSessionController(
            LiveSessionService liveService,
            TourService tourService)
        {
            _liveService = liveService;
            _tourService = tourService;
        }

        // POST api/LiveSession/start
        [HttpPost("start")]
        [Authorize]
        public async Task<IActionResult> Start([FromBody] StartSessionDto dto)
        {
            var creatorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(creatorId))
                return Unauthorized("Geen gebruiker gevonden");

            try
            {
                var session = await _liveService.StartSessionAsync(dto.Groep, dto.TourId, creatorId);
                var tour = await _tourService.GetByIdAsync(session.TourId);
                if (tour == null)
                    return BadRequest(new { message = "Tour niet gevonden." });

                var response = new LiveSessionDto
                {
                    Id = session.Id,
                    Groep = session.Groep,
                    StartDate = session.StartDate,
                    IsActive = session.IsActive,
                    CreatorId = session.CreatorId,
                    Tour = new TourDto
                    {
                        Id = tour.Id,
                        NaamLocatie = tour.NaamLocatie,
                        Fases = tour.Fases
                    }
                };
                return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
            }
            catch (InvalidOperationException ioe)
            {
                return BadRequest(new { message = ioe.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        // GET api/LiveSession/active
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

                // Als er geen sessies zijn, geef een lege lijst terug
                if (sessions == null || !sessions.Any())
                    return Ok(new List<LiveSessionDto>());

                var result = new List<LiveSessionDto>();
                foreach (var s in sessions)
                {
                    var tour = await _tourService.GetByIdAsync(s.TourId);
                    if (tour == null)
                        continue;

                    result.Add(new LiveSessionDto
                    {
                        Id = s.Id,
                        Groep = s.Groep,
                        StartDate = s.StartDate,
                        IsActive = s.IsActive,
                        CreatorId = s.CreatorId,
                        Tour = new TourDto
                        {
                            Id = tour.Id,
                            NaamLocatie = tour.NaamLocatie,
                            Fases = tour.Fases
                        }
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        // GET api/LiveSession/{id}
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

            var tour = await _tourService.GetByIdAsync(session.TourId);
            if (tour == null)
                return BadRequest(new { message = "Tour niet gevonden." });

            var response = new LiveSessionDto
            {
                Id = session.Id,
                Groep = session.Groep,
                StartDate = session.StartDate,
                IsActive = session.IsActive,
                CreatorId = session.CreatorId,
                Tour = new TourDto
                {
                    Id = tour.Id,
                    NaamLocatie = tour.NaamLocatie,
                    Fases = tour.Fases
                }
            };
            return Ok(response);
        }

        // GET api/LiveSession/public/{id}
        [HttpGet("public/{id:length(24)}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublic(string id)
        {
            var session = await _liveService.GetByIdAsync(id);
            if (session == null || !session.IsActive)
                return NotFound();

            var tour = await _tourService.GetByIdAsync(session.TourId);
            if (tour == null)
                return BadRequest(new { message = "Tour niet gevonden." });

            var publicDto = new LiveSessionPublicDto
            {
                Id = session.Id,
                Groep = session.Groep,
                StartDate = session.StartDate,
                Tour = new TourDto
                {
                    Id = tour.Id,
                    NaamLocatie = tour.NaamLocatie,
                    Fases = tour.Fases
                }
            };
            return Ok(publicDto);
        }

        // PATCH api/LiveSession/{id}/end
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
                return StatusCode(500, new { message = ex.ToString() });
            }
        }
    }

    public class StartSessionDto
    {
        public string Groep { get; set; } = null!;
        public string TourId { get; set; } = null!;
    }

    public class TourDto
    {
        public string Id { get; set; } = null!;
        public string NaamLocatie { get; set; } = null!;
        public Dictionary<string, List<BsonDocument>> Fases { get; set; } = null!;
    }

    public class LiveSessionDto
    {
        public string Id { get; set; } = null!;
        public string Groep { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public bool IsActive { get; set; }
        public string CreatorId { get; set; } = null!;
        public TourDto Tour { get; set; } = null!;
    }

    public class LiveSessionPublicDto
    {
        public string Id { get; set; } = null!;
        public string Groep { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public TourDto Tour { get; set; } = null!;
    }
}
