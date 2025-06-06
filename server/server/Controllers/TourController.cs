// File: server/Controllers/TourController.cs

using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;             // ← Voor BsonDocument, BsonTypeMapper
using server.Mappings;          // ← TourMapper
using server.Models;
using server.Models.Entities;   // ← Tour, Section, Component, Fases, …
using server.Services.Interfaces;  // ← Import interface ipv concrete
// using server.Services.Implementations; (kun je verwijderen als je TourService niet meer direct noemt)

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TourController : ControllerBase
    {
        private readonly ITourService _tourService;

        public TourController(ITourService tourService)   // <-- interface in constructor
        {
            _tourService = tourService;
        }

        // 1) GET api/tour → alle tours voor de ingelogde verhuurder
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId))
                return Unauthorized("Geen verhuurder gevonden");

            var tours = await _tourService.GetAllAsync();
            var response = tours
                .Where(t => t.VerhuurderId == verhuurderId)
                .Select(t => new
                {
                    id = t.Id,
                    naamLocatie = t.NaamLocatie,
                    verhuurderId = t.VerhuurderId,
                    fases = TourMapper.MapFasesToDto(t.Fases)
                })
                .ToList();

            return Ok(response);
        }

        // 2) GET api/tour/{id} → één tour (controle op eigenaar)
        [HttpGet("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id)
        {
            var tour = await _tourService.GetByIdAsync(id);
            if (tour == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || tour.VerhuurderId != verhuurderId)
                return Forbid();

            var dto = new
            {
                id = tour.Id,
                naamLocatie = tour.NaamLocatie,
                verhuurderId = tour.VerhuurderId,
                fases = TourMapper.MapFasesToDto(tour.Fases)
            };
            return Ok(dto);
        }

        // 3) POST api/tour → maak een nieuwe tour
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTourDto dto)
        {
            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId))
                return Unauthorized("Geen gebruiker gevonden");

            var tour = new Tour
            {
                NaamLocatie = dto.NaamLocatie,
                VerhuurderId = verhuurderId,
                Fases = new Fases()
            };
            await _tourService.CreateTourAsync(tour);

            var response = new
            {
                id = tour.Id,
                naamLocatie = tour.NaamLocatie,
                verhuurderId = tour.VerhuurderId,
                fases = new Dictionary<string, object>()
            };
            return Created($"/api/tour/{tour.Id}", response);
        }

        // 4) PUT api/tour/{id} → update enkel NaamLocatie
        [HttpPut("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateTourDto dto)
        {
            var existing = await _tourService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || existing.VerhuurderId != verhuurderId)
                return Forbid();

            existing.NaamLocatie = dto.NaamLocatie;
            await _tourService.UpdateTourAsync(id, existing);
            return NoContent();
        }

        // 5) DELETE api/tour/{id} → verwijder tour
        [HttpDelete("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> DeleteTour(string id)
        {
            var existing = await _tourService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || existing.VerhuurderId != verhuurderId)
                return Forbid();

            await _tourService.DeleteTourAsync(id);
            return NoContent();
        }

        // 6) SECTION CRUD binnen een fase
        [HttpPost("{tourId:length(24)}/fases/{fase}/sections")]
        [Authorize]
        public async Task<ActionResult<object>> AddSection(string tourId, string fase, [FromBody] CreateSectionDto dto)
        {
            var tour = await _tourService.GetByIdAsync(tourId);
            if (tour == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || tour.VerhuurderId != verhuurderId)
                return Forbid();

            var section = new Section { Naam = dto.Naam };
            var added = await _tourService.AddSectionAsync(tourId, fase, section);

            var response = new
            {
                id = added.Id,
                naam = added.Naam,
                components = new List<object>()
            };
            return Created($"/api/tour/{tourId}/fases/{fase}/sections/{added.Id}", response);
        }

        [HttpPut("{tourId:length(24)}/fases/{fase}/sections/{sectionId}")]
        [Authorize]
        public async Task<IActionResult> UpdateSectionName(string tourId, string fase, string sectionId, [FromBody] UpdateSectionDto dto)
        {
            var tour = await _tourService.GetByIdAsync(tourId);
            if (tour == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || tour.VerhuurderId != verhuurderId)
                return Forbid();

            var success = await _tourService.UpdateSectionNameAsync(tourId, fase, sectionId, dto.Naam);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{tourId:length(24)}/fases/{fase}/sections/{sectionId}")]
        [Authorize]
        public async Task<IActionResult> DeleteSection(string tourId, string fase, string sectionId)
        {
            var tour = await _tourService.GetByIdAsync(tourId);
            if (tour == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || tour.VerhuurderId != verhuurderId)
                return Forbid();

            var success = await _tourService.DeleteSectionAsync(tourId, fase, sectionId);
            if (!success) return NotFound();
            return NoContent();
        }

        // 7) COMPONENT CRUD binnen een SECTION
        [HttpPost("{tourId:length(24)}/fases/{fase}/sections/{sectionId}/components")]
        [Authorize]
        public async Task<ActionResult<object>> AddComponent(
            string tourId,
            string fase,
            string sectionId,
            [FromBody] CreateComponentDto dto)
        {
            var tour = await _tourService.GetByIdAsync(tourId);
            if (tour == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || tour.VerhuurderId != verhuurderId)
                return Forbid();

            var component = new Component
            {
                Type = dto.Type,
                Props = BsonDocument.Parse(dto.PropsJson)
            };
            var added = await _tourService.AddComponentAsync(tourId, fase, sectionId, component);

            var propsDict = added.Props
                .ToDictionary(
                    elem => elem.Name,
                    elem => BsonTypeMapper.MapToDotNetValue(elem.Value)
                );

            var response = new
            {
                id = added.Id,
                type = added.Type,
                props = propsDict
            };
            return Created(
                $"/api/tour/{tourId}/fases/{fase}/sections/{sectionId}/components/{added.Id}",
                response
            );
        }

        [HttpPut("{tourId:length(24)}/fases/{fase}/sections/{sectionId}/components/{componentId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComponent(
            string tourId,
            string fase,
            string sectionId,
            string componentId,
            [FromBody] UpdateComponentDto dto)
        {
            var tour = await _tourService.GetByIdAsync(tourId);
            if (tour == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || tour.VerhuurderId != verhuurderId)
                return Forbid();

            var nieuweProps = BsonDocument.Parse(dto.PropsJson);
            var success = await _tourService.UpdateComponentAsync(tourId, fase, sectionId, componentId, nieuweProps, dto.Type);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{tourId:length(24)}/fases/{fase}/sections/{sectionId}/components/{componentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComponent(
            string tourId,
            string fase,
            string sectionId,
            string componentId)
        {
            var tour = await _tourService.GetByIdAsync(tourId);
            if (tour == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || tour.VerhuurderId != verhuurderId)
                return Forbid();

            var success = await _tourService.DeleteComponentAsync(tourId, fase, sectionId, componentId);
            if (!success) return NotFound();
            return NoContent();
        }

        // DTO’s
        public class CreateTourDto
        {
            public string NaamLocatie { get; set; } = null!;
        }

        public class UpdateTourDto
        {
            public string NaamLocatie { get; set; } = null!;
        }

        public class CreateSectionDto
        {
            public string Naam { get; set; } = null!;
        }

        public class UpdateSectionDto
        {
            public string Naam { get; set; } = null!;
        }

        public class CreateComponentDto
        {
            public string Type { get; set; } = null!;

            // PropsJson moet “platte JSON” zijn: bv. { "text":"Hallo", "fontSize":22, "bold":true }
            public string PropsJson { get; set; } = null!;
        }

        public class UpdateComponentDto
        {
            public string Type { get; set; } = null!;
            public string PropsJson { get; set; } = null!;
        }
    }
}
