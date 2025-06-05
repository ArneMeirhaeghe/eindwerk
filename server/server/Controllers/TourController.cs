// File: server/Controllers/ToursController.cs
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Models;
using server.Services;
using MongoDB.Bson;                          // Voeg dit toe


namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToursController : ControllerBase
    {
        private readonly TourService _tourService;

        public ToursController(TourService tourService)
        {
            _tourService = tourService;
        }

        // ----- GET api/tours -----
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllTours()
        {
            var tours = await _tourService.GetAllAsync();
            var lijst = tours.Select(t => new
            {
                id = t.Id,
                naamLocatie = t.NaamLocatie
            }).ToList();
            return Ok(lijst);
        }

        // ----- GET api/tours/{id} -----
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<object>> GetTour(string id)
        {
            var tour = await _tourService.GetByIdAsync(id);
            if (tour == null) return NotFound();

            var fasesDict = TourMapper.MapFasesToDto(tour.Fases);
            var response = new
            {
                id = tour.Id,
                naamLocatie = tour.NaamLocatie,
                fases = fasesDict
            };
            return Ok(response);
        }

        // ----- POST api/tours -----
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<object>> CreateTour([FromBody] CreateTourDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NaamLocatie))
                return BadRequest("NaamLocatie is verplicht");

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId))
                return Unauthorized();

            var tour = new Tour
            {
                NaamLocatie = dto.NaamLocatie,
                VerhuurderId = verhuurderId,
                Fases = new Fases()
            };

            await _tourService.CreateTourAsync(tour);

            var fasesDict = TourMapper.MapFasesToDto(tour.Fases);
            var response = new
            {
                id = tour.Id,
                naamLocatie = tour.NaamLocatie,
                fases = fasesDict
            };

            return CreatedAtAction(nameof(GetTour), new { id = tour.Id }, response);
        }

        // ----- PUT api/tours/{id} -----
        [HttpPut("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> UpdateTour(string id, [FromBody] UpdateTourDto dto)
        {
            var existing = await _tourService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || existing.VerhuurderId != verhuurderId)
                return Forbid();

            if (string.IsNullOrWhiteSpace(dto.NaamLocatie))
                return BadRequest("NaamLocatie is verplicht");

            existing.NaamLocatie = dto.NaamLocatie;
            await _tourService.UpdateTourAsync(id, existing);
            return NoContent();
        }

        // ----- DELETE api/tours/{id} -----
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

        // ----- SECTION CRUD binnen een fase -----
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
            return Created($"/api/tours/{tourId}/fases/{fase}/sections/{added.Id}", response);
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

        // ----- COMPONENT CRUD binnen een SECTION -----
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

            // Converteer BsonDocument (added.Props) naar Dictionary<string, object>
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
                $"/api/tours/{tourId}/fases/{fase}/sections/{sectionId}/components/{added.Id}",
                response
            );
        }

        [HttpPut("{tourId:length(24)}/fases/{fase}/sections/{sectionId}/components/{componentId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComponent(string tourId, string fase, string sectionId, string componentId, [FromBody] UpdateComponentDto dto)
        {
            var tour = await _tourService.GetByIdAsync(tourId);
            if (tour == null) return NotFound();

            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(verhuurderId) || tour.VerhuurderId != verhuurderId)
                return Forbid();

            var nieuweProps = MongoDB.Bson.BsonDocument.Parse(dto.PropsJson);
            var success = await _tourService.UpdateComponentAsync(tourId, fase, sectionId, componentId, nieuweProps, dto.Type);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{tourId:length(24)}/fases/{fase}/sections/{sectionId}/components/{componentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComponent(string tourId, string fase, string sectionId, string componentId)
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
            public string PropsJson { get; set; } = null!;
        }

        public class UpdateComponentDto
        {
            public string Type { get; set; } = null!;
            public string PropsJson { get; set; } = null!;
        }
    }
}
