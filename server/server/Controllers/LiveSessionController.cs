// File: server/Controllers/LiveSessionController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LiveSessionController : ControllerBase
    {
        private readonly LiveSessionService _liveService;
        private readonly TourService _tourService;

        public LiveSessionController(LiveSessionService liveService, TourService tourService)
        {
            _liveService = liveService;
            _tourService = tourService;
        }

        /// <summary>
        /// Start een nieuwe live-sessie:
        /// BODY = { "groep": ".", "tourId": "." }
        /// Vereist [Authorize] (Bearer JWT).
        /// </summary>
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

                var fasesDict = TourMapper.MapFasesToDto(tour.Fases);

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
                        Fases = fasesDict
                    },
                    PublicUrl = $"/api/LiveSession/public/{session.Id}"
                };

                return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
            }
            catch (InvalidOperationException ioe)
            {
                return BadRequest(new { message = ioe.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] LiveSessionController.Start: {ex}");
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        /// <summary>
        /// Haal alle actieve sessies op voor ingelogde user.
        /// GET /api/LiveSession/active 
        /// Vereist [Authorize].
        /// </summary>
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
                if (sessions == null || !sessions.Any())
                    return Ok(new List<LiveSessionDto>());

                var result = new List<LiveSessionDto>();
                foreach (var s in sessions)
                {
                    TourDto? tourDto = null;
                    try
                    {
                        var tour = await _tourService.GetByIdAsync(s.TourId);
                        if (tour != null)
                        {
                            var fasesDict = TourMapper.MapFasesToDto(tour.Fases);
                            tourDto = new TourDto
                            {
                                Id = tour.Id,
                                NaamLocatie = tour.NaamLocatie,
                                Fases = fasesDict
                            };
                        }
                    }
                    catch (Exception exTour)
                    {
                        Console.WriteLine($"[ERROR] Fout bij ophalen Tour voor TourId={s.TourId}: {exTour}");
                        continue;
                    }

                    if (tourDto == null)
                        continue;

                    result.Add(new LiveSessionDto
                    {
                        Id = s.Id,
                        Groep = s.Groep,
                        StartDate = s.StartDate,
                        IsActive = s.IsActive,
                        CreatorId = s.CreatorId,
                        Tour = tourDto,
                        PublicUrl = $"/api/LiveSession/public/{s.Id}"
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] LiveSessionController.GetActive: {ex}");
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        /// <summary>
        /// Haal één sessie op (eigenaar). GET /api/LiveSession/{id}
        /// Vereist [Authorize].
        /// </summary>
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

            var fasesDict = TourMapper.MapFasesToDto(tour.Fases);

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
                    Fases = fasesDict
                },
                PublicUrl = $"/api/LiveSession/public/{session.Id}"
            };
            return Ok(response);
        }

        /// <summary>
        /// Publieke weergave (geen login nodig) van een actieve sessie + tour/fasen.
        /// GET /api/LiveSession/public/{id}
        /// </summary>
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

            var fasesDict = TourMapper.MapFasesToDto(tour.Fases);

            var publicDto = new LiveSessionPublicDto
            {
                Id = session.Id,
                Groep = session.Groep,
                StartDate = session.StartDate,
                Tour = new TourDto
                {
                    Id = tour.Id,
                    NaamLocatie = tour.NaamLocatie,
                    Fases = fasesDict
                }
            };
            return Ok(publicDto);
        }

        /// <summary>
        /// Zet IsActive = false (eindig sessie).
        /// PATCH /api/LiveSession/{id}/end
        /// Vereist [Authorize].
        /// </summary>
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

        // Hulpfunctie om Fases (List<Section>) te mappen naar DTO
        private static class TourMapper
        {
            public static Dictionary<string, List<SectionDto>> MapFasesToDto(Fases fases)
            {
                var dict = new Dictionary<string, List<SectionDto>>();

                void Map(string naam, List<Section> secties)
                {
                    var sectionDtos = secties.Select(sec => new SectionDto
                    {
                        Id = sec.Id,
                        Naam = sec.Naam,
                        Components = sec.Components.Select(comp => new ComponentDto
                        {
                            Id = comp.Id,
                            Type = comp.Type,
                            Props = comp.Props.ToDictionary(
                                elem => elem.Name,
                                elem => BsonTypeMapper.MapToDotNetValue(elem.Value)
                            )
                        }).ToList()
                    }).ToList();

                    if (sectionDtos.Any())
                        dict.Add(naam, sectionDtos);
                }

                Map("voor", fases.Voor);
                Map("aankomst", fases.Aankomst);
                Map("terwijl", fases.Terwijl);
                Map("vertrek", fases.Vertrek);
                Map("na", fases.Na);

                return dict;
            }
        }

        // DTO voor POST /start
        public class StartSessionDto
        {
            public string Groep { get; set; } = null!;
            public string TourId { get; set; } = null!;
        }

        // Response-DTO’s
        public class LiveSessionDto
        {
            public string Id { get; set; } = null!;
            public string Groep { get; set; } = null!;
            public DateTime StartDate { get; set; }
            public bool IsActive { get; set; }
            public string CreatorId { get; set; } = null!;
            public TourDto Tour { get; set; } = null!;
            public string PublicUrl { get; set; } = null!;
        }

        public class LiveSessionPublicDto
        {
            public string Id { get; set; } = null!;
            public string Groep { get; set; } = null!;
            public DateTime StartDate { get; set; }
            public TourDto Tour { get; set; } = null!;
        }

        public class TourDto
        {
            public string Id { get; set; } = null!;
            public string NaamLocatie { get; set; } = null!;
            public Dictionary<string, List<SectionDto>> Fases { get; set; } = new();
        }

        public class SectionDto
        {
            public string Id { get; set; } = null!;
            public string Naam { get; set; } = null!;
            public List<ComponentDto> Components { get; set; } = new();
        }

        public class ComponentDto
        {
            public string Id { get; set; } = null!;
            public string Type { get; set; } = null!;
            public Dictionary<string, object> Props { get; set; } = new();
        }
    }
}
