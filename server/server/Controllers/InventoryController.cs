// File: server/Controllers/InventoryController.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.Mappings;
using server.Models.DTOs.Inventory;
using server.Models.Entities;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            var list = await _svc.GetAllAsync();
            return list.ConvertAll(InventoryMapper.ToDto);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<InventoryTemplateDto>> GetById(string id)
        {
            var tmpl = await _svc.GetByIdAsync(id);
            if (tmpl == null) return NotFound();
            return InventoryMapper.ToDto(tmpl);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateInventoryTemplateDto dto)
        {
            var entity = InventoryMapper.FromCreateDto(dto);
            await _svc.CreateAsync(entity);
            return Created($"/api/inventory/{entity.Id}", InventoryMapper.ToDto(entity));
        }

        [HttpPut("{id:length(24)}")]
        public async Task<ActionResult> Update(string id, [FromBody] UpdateInventoryTemplateDto dto)
        {
            var success = await _svc.UpdateAsync(id, dto);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<ActionResult> Delete(string id)
        {
            var success = await _svc.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}
