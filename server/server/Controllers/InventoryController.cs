// File: Controllers/InventoryController.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.Mappings;
using server.Models.DTOs.Inventory;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/inventory")]
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
            return Ok(list.ConvertAll(InventoryMapper.ToDto));
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<InventoryTemplateDto>> GetById(string id)
        {
            var tmpl = await _svc.GetByIdAsync(id);
            return tmpl == null ? NotFound() : Ok(InventoryMapper.ToDto(tmpl));
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
