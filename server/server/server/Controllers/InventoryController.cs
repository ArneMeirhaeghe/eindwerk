// server/Controllers/InventoryController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using server.Models;
using server.Models.DTOs;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InventoryController : ControllerBase
    {
        private readonly InventoryService _inventory;
        public InventoryController(InventoryService inventory) => _inventory = inventory;

        [HttpGet("user/{ownerId}")]
        public async Task<ActionResult<List<InventorySection>>> GetByUser(string ownerId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!User.IsInRole("admin") && ownerId != userId)
                return Forbid();

            try
            {
                var list = await _inventory.GetAllByUser(ownerId);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching sections: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InventorySection>> Get(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Ongeldig ID-formaat.");

            try
            {
                var section = await _inventory.GetById(id);
                return section is null ? NotFound() : Ok(section);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching section: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<InventorySection>> Post([FromBody] InventorySectionRequest req)
        {
            try
            {
                var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var section = new InventorySection
                {
                    OwnerId = ownerId,
                    Title = req.Title,
                    Items = req.Items
                               .Select(i => new InventoryItem
                               {
                                   Id = Guid.NewGuid().ToString(),  // genereer item-UUID hier
                                   Name = i.Name,
                                   CurrentCount = i.CurrentCount,
                                   ExpectedCount = i.ExpectedCount
                               })
                               .ToList()
                };

                var created = await _inventory.Create(section);
                return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating section: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] InventorySectionRequest req)
        {
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Ongeldig ID-formaat.");

            try
            {
                // eerst het bestaande object ophalen
                var existing = await _inventory.GetById(id);
                if (existing is null) return NotFound();

                // update enkel de velden
                existing.Title = req.Title;
                existing.Items = req.Items
                    .Select(i => new InventoryItem
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = i.Name,
                        CurrentCount = i.CurrentCount,
                        ExpectedCount = i.ExpectedCount
                    })
                    .ToList();

                var ok = await _inventory.Update(id, existing);
                return ok ? NoContent() : NotFound($"Section {id} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating section: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Ongeldig ID-formaat.");

            try
            {
                var ok = await _inventory.Delete(id);
                return ok ? NoContent() : NotFound($"Section {id} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting section: {ex.Message}");
            }
        }
    }
}
