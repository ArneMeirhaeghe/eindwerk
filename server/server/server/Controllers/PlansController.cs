// server/Controllers/PlansController.cs
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using server.Models;
using server.Services;

namespace server.Controllers
{
    /// <summary>
    /// Beheert CRUD-operaties voor rondleidingen (plans).
    /// Alleen ingelogde gebruikers mogen lezen, schrijven, updaten en verwijderen,
    /// behalve de “public” endpoints die anoniem toegankelijk zijn.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PlansController : ControllerBase
    {
        private readonly MongoService _mongo;

        public PlansController(MongoService mongo)
        {
            _mongo = mongo;
        }

        /// <summary>
        /// Haal alle plannen op voor een specifieke eigenaar.
        /// Alleen de eigenaar zelf of een admin mag dit.
        /// </summary>
        [HttpGet("user/{ownerId}")]
        public async Task<ActionResult<List<Plan>>> GetByUser(string ownerId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("admin");

            if (!isAdmin && ownerId != currentUserId)
                return Forbid("Je mag enkel je eigen plannen zien.");

            var plans = await _mongo.GetAllByUser(ownerId);
            return Ok(plans);
        }

        /// <summary>
        /// Maak een nieuw plan. De PublicId wordt automatisch gegenereerd.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Plan plan)
        {
            plan.PublicId = Guid.NewGuid().ToString("N")[..8];
            await _mongo.Create(plan);
            return CreatedAtAction(nameof(GetById), new { id = plan.Id }, plan);
        }

        /// <summary>
        /// Vervang een bestaand plan volledig.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Plan plan)
        {
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Ongeldig ID-formaat.");

            await _mongo.Update(id, plan);
            return NoContent();
        }

        /// <summary>
        /// Verwijder een plan op basis van ID.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Ongeldig ID-formaat.");

            await _mongo.Delete(id);
            return NoContent();
        }

        /// <summary>
        /// Haal één plan op via intern ID.
        /// Anoniem toegankelijk.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Plan>> GetById(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Ongeldig ID-formaat.");

            var plan = await _mongo.Get(id);
            return plan is null ? NotFound() : Ok(plan);
        }

        /// <summary>
        /// Haal één plan op via publieke ID.
        /// Anoniem toegankelijk.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("public/{publicId}")]
        public async Task<ActionResult<Plan>> GetByPublicId(string publicId)
        {
            var plan = await _mongo.GetByPublicId(publicId);
            return plan is null ? NotFound() : Ok(plan);
        }
    }
}
