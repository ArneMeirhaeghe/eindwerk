// File: Controllers/LiveSessionController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LiveSessionController : ControllerBase
    {
        private readonly LiveSessionService _service;

        public LiveSessionController(LiveSessionService service)
        {
            _service = service;
        }

        // POST api/LiveSession/start
        [HttpPost("start")]
        public async Task<IActionResult> Start([FromBody] StartSessionDto dto)
        {
            try
            {
                var session = await _service.StartSessionAsync(dto.Groep, dto.TourId);

                // Map het opgeslagen LiveSession-object naar LiveSessionDto:
                var responseDto = new LiveSessionDto
                {
                    Id = session.Id,
                    Groep = session.Groep,
                    TourId = session.Tour?.Id,
                    TourNaam = session.Tour?.NaamLocatie,
                    StartDate = session.StartDate,
                    IsActive = session.IsActive
                };

                return CreatedAtAction(nameof(GetById), new { id = responseDto.Id }, responseDto);
            }
            catch (KeyNotFoundException knf)
            {
                return BadRequest(new { message = knf.Message });
            }
            catch (InvalidOperationException ioe)
            {
                return BadRequest(new { message = ioe.Message });
            }
            catch (Exception ex)
            {
                // Tijdens debug: zend de volledige exception-tekst in JSON
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        // GET api/LiveSession/active
        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            try
            {
                var sessions = await _service.GetActiveSessionsAsync();

                // Map elk LiveSession-object naar de dto
                var result = sessions.Select(s => new LiveSessionDto
                {
                    Id = s.Id,
                    Groep = s.Groep,
                    TourId = s.Tour?.Id,
                    TourNaam = s.Tour?.NaamLocatie,
                    StartDate = s.StartDate,
                    IsActive = s.IsActive
                })
                .ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        // GET api/LiveSession/{id}
        [HttpGet("{id:length(24)}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var session = await _service.GetByIdAsync(id);
                if (session == null)
                    return NotFound();

                // Map naar dto
                var responseDto = new LiveSessionDto
                {
                    Id = session.Id,
                    Groep = session.Groep,
                    TourId = session.Tour?.Id,
                    TourNaam = session.Tour?.NaamLocatie,
                    StartDate = session.StartDate,
                    IsActive = session.IsActive
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        // PATCH api/LiveSession/{id}/end
        [HttpPatch("{id:length(24)}/end")]
        public async Task<IActionResult> EndSession(string id)
        {
            try
            {
                var existing = await _service.GetByIdAsync(id);
                if (existing == null)
                    return NotFound();

                await _service.EndSessionAsync(id);
                return NoContent();
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
}
