// Controllers/LiveSessionController.cs
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using System;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            var session = await _service.StartSessionAsync(dto.Groep, dto.TourId);
            return CreatedAtAction(nameof(GetActive), new { id = session.Id }, session);
        }

        // GET api/LiveSession/active
        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var sessions = await _service.GetActiveSessionsAsync();
            return Ok(sessions);
        }

        // GET api/LiveSession/check-start
        [HttpGet("check-start")]
        public async Task<IActionResult> CheckStart()
        {
            var created = await _service.CreateSessionsForUpcomingAsync();
            return Ok(new { created });
        }
    }

    public class StartSessionDto
    {
        public string Groep { get; set; }
        public string TourId { get; set; }
    }
}
