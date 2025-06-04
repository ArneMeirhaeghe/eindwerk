//// File: Controllers/RentalPeriodsController.cs
//using Microsoft.AspNetCore.Mvc;
//using server.Models;
//using server.Services;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace server.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class RentalPeriodsController : ControllerBase
//    {
//        private readonly RentalPeriodService _service;

//        public RentalPeriodsController(RentalPeriodService service)
//        {
//            _service = service;
//        }

//        // GET api/RentalPeriods
//        [HttpGet]
//        public async Task<ActionResult<List<VerhuurPeriode>>> GetAll()
//        {
//            var rentals = await _service.GetAllAsync();
//            return Ok(rentals);
//        }

//        // GET api/RentalPeriods/{id}
//        [HttpGet("{id:length(24)}")]
//        public async Task<ActionResult<VerhuurPeriode>> GetById(string id)
//        {
//            var rental = await _service.GetByIdAsync(id);
//            if (rental == null) return NotFound();
//            return Ok(rental);
//        }

//        // POST api/RentalPeriods
//        [HttpPost]
//        public async Task<ActionResult<VerhuurPeriode>> Create([FromBody] VerhuurPeriode rental)
//        {
//            await _service.CreateAsync(rental);
//            return CreatedAtAction(nameof(GetById), new { id = rental.Id }, rental);
//        }

//        // PUT api/RentalPeriods/{id}
//        [HttpPut("{id:length(24)}")]
//        public async Task<IActionResult> Update(string id, [FromBody] VerhuurPeriode updated)
//        {
//            var existing = await _service.GetByIdAsync(id);
//            if (existing == null) return NotFound();
//            updated.Id = existing.Id;
//            await _service.UpdateAsync(id, updated);
//            return NoContent();
//        }

//        // PATCH api/RentalPeriods/{id}/tour
//        [HttpPatch("{id:length(24)}/tour")]
//        public async Task<IActionResult> PatchTour(string id, [FromBody] PatchTourDto dto)
//        {
//            var existing = await _service.GetByIdAsync(id);
//            if (existing == null) return NotFound();
//            await _service.PatchTourAsync(id, dto.TourId);
//            return NoContent();
//        }

//        // DELETE api/RentalPeriods/{id}
//        [HttpDelete("{id:length(24)}")]
//        public async Task<IActionResult> Delete(string id)
//        {
//            var existing = await _service.GetByIdAsync(id);
//            if (existing == null) return NotFound();
//            await _service.DeleteAsync(id);
//            return NoContent();
//        }
//    }

//    public class PatchTourDto
//    {
//        public string TourId { get; set; } = null!;
//    }
//}
