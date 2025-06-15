// File: server/Controllers/InventoryController.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using server.Mappings;
using server.Models.DTOs.Inventory;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/inventory")]
    [Authorize]  // Alleen geauthenticeerde users
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _svc;

        public InventoryController(IInventoryService svc)
        {
            _svc = svc;
        }

        [HttpGet]
        public async Task<ActionResult<List<InventoryTemplateDto>>> GetAll()
        {
            // Haal user ID uit JWT claims
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var list = await _svc.GetAllAsync(userId);
            return Ok(list.ConvertAll(InventoryMapper.ToDto));
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<InventoryTemplateDto>> GetById(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var tmpl = await _svc.GetByIdAsync(id, userId);
            return tmpl == null
                ? NotFound()
                : Ok(InventoryMapper.ToDto(tmpl));
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateInventoryTemplateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var entity = InventoryMapper.FromCreateDto(dto);
            await _svc.CreateAsync(entity, userId);
            return Created($"/api/inventory/{entity.Id}", InventoryMapper.ToDto(entity));
        }

        [HttpPut("{id:length(24)}")]
        public async Task<ActionResult> Update(string id, [FromBody] UpdateInventoryTemplateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var success = await _svc.UpdateAsync(id, dto, userId);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<ActionResult> Delete(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var success = await _svc.DeleteAsync(id, userId);
            return success ? NoContent() : NotFound();
        }
    }
}
