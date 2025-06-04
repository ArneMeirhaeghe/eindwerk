//// File: Controllers/InventoryController.cs
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using server.Models;
//using server.Services;
//using System.Collections.Generic;
//using System.Security.Claims;
//using System.Threading.Tasks;

//namespace server.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    [Authorize]
//    public class InventoryController : ControllerBase
//    {
//        private readonly InventoryService _svc;
//        public InventoryController(InventoryService svc) => _svc = svc;

//        // helper om huidige userId te lezen
//        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

//        [HttpGet("sections")]
//        public Task<List<Section>> GetSections() =>
//            _svc.GetAllSectionsAsync(UserId);

//        [HttpGet("sections/{id:length(24)}")]
//        public async Task<ActionResult<Section>> GetSection(string id)
//        {
//            var sec = await _svc.GetSectionByIdAsync(UserId, id);
//            if (sec == null) return NotFound();
//            return sec;
//        }

//        [HttpPost("sections")]
//        public async Task<ActionResult<Section>> CreateSection(Section section)
//        {
//            var created = await _svc.CreateSectionAsync(UserId, section);
//            return CreatedAtAction(nameof(GetSection), new { id = created.Id }, created);
//        }

//        [HttpPut("sections/{id:length(24)}")]
//        public async Task<IActionResult> UpdateSection(string id, Section sectionIn)
//        {
//            if (!await _svc.UpdateSectionAsync(UserId, id, sectionIn)) return NotFound();
//            return NoContent();
//        }

//        [HttpDelete("sections/{id:length(24)}")]
//        public async Task<IActionResult> DeleteSection(string id)
//        {
//            if (!await _svc.DeleteSectionAsync(UserId, id)) return NotFound();
//            return NoContent();
//        }

//        [HttpGet("sections/{sectionId:length(24)}/items")]
//        public Task<List<Item>> GetItems(string sectionId) =>
//            _svc.GetItemsAsync(UserId, sectionId);

//        [HttpGet("sections/{sectionId:length(24)}/items/{itemId:length(24)}")]
//        public async Task<ActionResult<Item>> GetItem(string sectionId, string itemId)
//        {
//            var itm = await _svc.GetItemAsync(UserId, sectionId, itemId);
//            if (itm == null) return NotFound();
//            return itm;
//        }

//        [HttpPost("sections/{sectionId:length(24)}/items")]
//        public async Task<ActionResult<Item>> CreateItem(string sectionId, Item item)
//        {
//            var created = await _svc.CreateItemAsync(UserId, sectionId, item);
//            return CreatedAtAction(nameof(GetItem), new { sectionId, itemId = created.Id }, created);
//        }

//        [HttpPut("sections/{sectionId:length(24)}/items/{itemId:length(24)}")]
//        public async Task<IActionResult> UpdateItem(string sectionId, string itemId, Item itemIn)
//        {
//            if (!await _svc.UpdateItemAsync(UserId, sectionId, itemId, itemIn)) return NotFound();
//            return NoContent();
//        }

//        [HttpDelete("sections/{sectionId:length(24)}/items/{itemId:length(24)}")]
//        public async Task<IActionResult> DeleteItem(string sectionId, string itemId)
//        {
//            if (!await _svc.DeleteItemAsync(UserId, sectionId, itemId)) return NotFound();
//            return NoContent();
//        }
//    }
//}
