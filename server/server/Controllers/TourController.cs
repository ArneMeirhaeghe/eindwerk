// File: Controllers/TourController.cs
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using server.Mappings;
using server.Models.DTOs.Tour;
using server.Models.Entities;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/tour")]
    public class TourController : ControllerBase
    {
        private readonly ITourService _tourService;

        public TourController(ITourService tourService)
        {
            _tourService = tourService;
        }

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

        [HttpGet("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id)
        {
            var tour = await _tourService.GetByIdAsync(id);
            if (tour == null) return NotFound();

            var verhuurderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (tour.VerhuurderId != verhuurderId) return Forbid();

            return Ok(new
            {
                id = tour.Id,
                naamLocatie = tour.NaamLocatie,
                fases = TourMapper.MapFasesToDto(tour.Fases)
            });
        }

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

        [HttpDelete("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> DeleteTour(string id)
        {
            await _tourService.DeleteTourAsync(id);
            return NoContent();
        }

        [HttpPost("{tourId:length(24)}/fases/{fase}/sections")]
        [Authorize]
        public async Task<ActionResult<object>> AddSection(string tourId, string fase, [FromBody] CreateSectionDto dto)
        {
            var added = await _tourService.AddSectionAsync(tourId, fase, new Section { Naam = dto.Naam });
            return Created($"/api/tour/{tourId}/fases/{fase}/sections/{added.Id}", new
            {
                id = added.Id,
                naam = added.Naam,
                components = new List<object>()
            });
        }

        [HttpPut("{tourId:length(24)}/fases/{fase}/sections/{sectionId}")]
        [Authorize]
        public async Task<IActionResult> UpdateSectionName(
            string tourId, string fase, string sectionId, [FromBody] UpdateSectionDto dto)
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

        [HttpPost("{tourId:length(24)}/fases/{fase}/sections/{sectionId}/components")]
        [Authorize]
        public async Task<ActionResult<object>> AddComponent(
            string tourId, string fase, string sectionId, [FromBody] CreateComponentDto dto)
        {
            var comp = new Component { Type = dto.Type, Props = BsonDocument.Parse(dto.PropsJson) };
            var added = await _tourService.AddComponentAsync(tourId, fase, sectionId, comp);
            var props = added.Props.ToDictionary(e => e.Name, e => BsonTypeMapper.MapToDotNetValue(e.Value));
            return Created(
                $"/api/tour/{tourId}/fases/{fase}/sections/{sectionId}/components/{added.Id}",
                new { id = added.Id, type = added.Type, props }
            );
        }

        [HttpPut("{tourId:length(24)}/fases/{fase}/sections/{sectionId}/components/{componentId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComponent(
            string tourId, string fase, string sectionId, string componentId, [FromBody] UpdateComponentDto dto)
        {
            var props = BsonDocument.Parse(dto.PropsJson);
            var success = await _tourService.UpdateComponentAsync(tourId, fase, sectionId, componentId, props, dto.Type);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{tourId:length(24)}/fases/{fase}/sections/{sectionId}/components/{componentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComponent(
            string tourId, string fase, string sectionId, string componentId)
        {
            var success = await _tourService.DeleteComponentAsync(tourId, fase, sectionId, componentId);
            return success ? NoContent() : NotFound();
        }
    }
}
