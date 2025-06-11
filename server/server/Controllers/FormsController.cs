// File: server/Controllers/FormsController.cs
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Models.Entities;
using server.Mappings;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormsController : ControllerBase
    {
        private readonly IFormService _svc;
        public FormsController(IFormService svc) => _svc = svc;

        // Helpers: normalize JsonElement-waarden naar CLR types
        private static Dictionary<string, object> NormalizeSettings(Dictionary<string, object> raw)
        {
            var result = new Dictionary<string, object>();
            foreach (var kv in raw)
            {
                if (kv.Value is JsonElement je)
                {
                    object val = je.ValueKind switch
                    {
                        JsonValueKind.String => je.GetString()!,
                        JsonValueKind.Number => je.GetDouble(),
                        JsonValueKind.True => true,
                        JsonValueKind.False => false,
                        JsonValueKind.Array => je.EnumerateArray()
                                                    .Select(e => e.ValueKind == JsonValueKind.String
                                                        ? e.GetString()!
                                                        : e.GetRawText())
                                                    .ToList(),
                        _ => je.GetRawText()
                    };
                    result[kv.Key] = val;
                }
                else
                {
                    result[kv.Key] = kv.Value!;
                }
            }
            return result;
        }

        [HttpGet]
        public async Task<ActionResult<List<FormDto>>> GetAll()
        {
            var list = await _svc.GetAllAsync();
            return list.Select(f => f.ToDto()).ToList();
        }

        [HttpGet("{id:length(24)}", Name = "GetForm")]
        public async Task<ActionResult<FormDto>> GetById(string id)
        {
            var f = await _svc.GetByIdAsync(id);
            if (f is null) return NotFound();
            return f.ToDto();
        }

        [HttpPost]
        public async Task<ActionResult<FormDto>> Create(CreateFormDto dto)
        {
            var entity = new Form
            {
                Name = dto.Name,
                Fields = dto.Fields.Select(f => new Field
                {
                    Id = f.Id,
                    Type = f.Type,
                    Label = f.Label,
                    Settings = NormalizeSettings(f.Settings),
                    Order = f.Order
                }).ToList()
            };
            var created = await _svc.CreateAsync(entity);
            return CreatedAtRoute("GetForm", new { id = created.Id }, created.ToDto());
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, UpdateFormDto dto)
        {
            var exists = await _svc.GetByIdAsync(id);
            if (exists is null) return NotFound();

            var updated = new Form
            {
                Id = id,
                Name = dto.Name,
                Fields = dto.Fields.Select(f => new Field
                {
                    Id = f.Id,
                    Type = f.Type,
                    Label = f.Label,
                    Settings = NormalizeSettings(f.Settings),
                    Order = f.Order
                }).ToList()
            };

            await _svc.UpdateAsync(id, updated);
            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var exists = await _svc.GetByIdAsync(id);
            if (exists is null) return NotFound();
            await _svc.DeleteAsync(id);
            return NoContent();
        }
    }
}
