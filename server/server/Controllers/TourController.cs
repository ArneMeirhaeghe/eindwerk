// File: server/Controllers/TourController.cs

using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;                   // BsonDocument, BsonTypeMapper
using server.Mappings;                // TourMapper
using server.Models.Entities;         // Tour, Section, Component, Fases
using server.Services.Interfaces;     // ITourService
using server.Models.DTOs.Tour;        // Create/Update DTO’s

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TourController : ControllerBase
    {
        private readonly ITourService _tourService;

        public TourController(ITourService tourService)
        {
            _tourService = tourService;     // interface injectie
        }

        // 1) GET api/tour → alle tours voor ingelogde verhuurder
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var verhuurderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tours = await _tourService.GetAllAsync();
            var response = tours
                .Where(t => t.VerhuurderId == verhuurderId)
                .Select(t => new {
                    id = t.Id,
                    naamLocatie = t.NaamLocatie,
                    fases = TourMapper.MapFasesToDto(t.Fases)
                })
                .ToList();
            return Ok(response);
        }

        // 2) GET api/tour/{id} → detail van één tour
        [HttpGet("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id)
        {
            var tour = await _tourService.GetByIdAsync(id);
            if (tour == null) return NotFound();
            var verhuurderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (tour.VerhuurderId != verhuurderId) return Forbid();

            var dto = new
            {
                id = tour.Id,
                naamLocatie = tour.NaamLocatie,
                fases = TourMapper.MapFasesToDto(tour.Fases)
            };
            return Ok(dto);
        }

        // 3) POST api/tour → nieuw tour-document
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTourDto dto)
        {
            var verhuurderId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var tour = new Tour
            {
                NaamLocatie = dto.NaamLocatie,
                VerhuurderId = verhuurderId,
                Fases = new Fases()
            };
            await _tourService.CreateTourAsync(tour);
            return Created($"/api/tour/{tour.Id}", new
            {
                id = tour.Id,
                naamLocatie = tour.NaamLocatie,
                fases = new Dictionary<string, object>()
            });
        }

        // 4) PUT api/tour/{id} → update naamLocatie
        [HttpPut("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateTourDto dto)
        {
            var existing = await _tourService.GetByIdAsync(id);
            if (existing == null) return NotFound();
            existing.NaamLocatie = dto.NaamLocatie;
            await _tourService.UpdateTourAsync(id, existing);
            return NoContent();
        }

        // 5) DELETE api/tour/{id}
        [HttpDelete("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> DeleteTour(string id)
        {
            await _tourService.DeleteTourAsync(id);
            return NoContent();
        }

        // 6) SECTION CRUD binnen een fase
        [HttpPost("{tourId:length(24)}/fases/{fase}/sections")]
        [Authorize]
        public async Task<ActionResult<object>> AddSection(string tourId, string fase, [FromBody] CreateSectionDto dto)
        {
            var section = new Section { Naam = dto.Naam };
            var added = await _tourService.AddSectionAsync(tourId, fase, section);
            return Created($"/api/tour/{tourId}/fases/{fase}/sections/{added.Id}", new
            {
                id = added.Id,
                naam = added.Naam,
                components = new List<object>()
            });
        }

        [HttpPut("{tourId:length(24)}/fases/{fase}/sections/{sectionId}")]
        [Authorize]
        public async Task<IActionResult> UpdateSectionName(string tourId, string fase, string sectionId, [FromBody] UpdateSectionDto dto)
        {
            var success = await _tourService.UpdateSectionNameAsync(tourId, fase, sectionId, dto.Naam);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{tourId:length(24)}/fases/{fase}/sections/{sectionId}")]
        [Authorize]
        public async Task<IActionResult> DeleteSection(string tourId, string fase, string sectionId)
        {
            var success = await _tourService.DeleteSectionAsync(tourId, fase, sectionId);
            return success ? NoContent() : NotFound();
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
            var component = new Component
            {
                Type = dto.Type,
                Props = BsonDocument.Parse(dto.PropsJson)
            };
            var added = await _tourService.AddComponentAsync(tourId, fase, sectionId, component);
            var props = added.Props
                .ToDictionary(e => e.Name, e => BsonTypeMapper.MapToDotNetValue(e.Value));
            return Created(
                $"/api/tour/{tourId}/fases/{fase}/sections/{sectionId}/components/{added.Id}",
                new { id = added.Id, type = added.Type, props }
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
            var nieuweProps = BsonDocument.Parse(dto.PropsJson);
            var success = await _tourService.UpdateComponentAsync(
                tourId, fase, sectionId, componentId, nieuweProps, dto.Type
            );
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{tourId:length(24)}/fases/{fase}/sections/{sectionId}/components/{componentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComponent(
            string tourId,
            string fase,
            string sectionId,
            string componentId)
        {
            var success = await _tourService.DeleteComponentAsync(tourId, fase, sectionId, componentId);
            return success ? NoContent() : NotFound();
        }
    }
}
