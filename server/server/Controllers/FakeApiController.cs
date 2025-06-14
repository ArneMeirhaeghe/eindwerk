// File: Controllers/FakeApiController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models.Entities;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/fakeapi")]
    [Authorize]
    public class FakeApiController : ControllerBase
    {
        [HttpGet("verhuurperiodes")]
        public IActionResult GetVerhuurperiodes()
        {
            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (verhuurderId == null)
                return Unauthorized("Geen verhuurder ID gevonden");

            var vandaag = DateTime.Now;
            var random = new Random();
            var groepen = new[]
            {
                "KSA Brugge", "KSA Gent", "KSA Mechelen", "KSA Oudenaarde",
                "KSA Hasselt", "KSA Antwerpen", "KSA Zottegem", "KSA Deinze",
                "KSA Leuven", "KSA Kortrijk"
            };
            var namen = new[]
            {
                "Lotte Peeters", "Tom Van Damme", "Elien De Smet", "Jens Vandenberghe",
                "Sofie De Wilde", "Daan Goossens", "Nina Martens", "Wout Claes",
                "Amber Willems", "Bram De Bruyne"
            };

            var periodes = new List<VerhuurPeriode>();
            for (int i = 0; i < 10; i++)
            {
                var groep = groepen[i];
                var naam = namen[i];
                var offset = i switch
                {
                    0 => -14,
                    1 => -10,
                    2 => -7,
                    3 => -2,
                    4 => 0,
                    5 => 1,
                    6 => 4,
                    7 => 7,
                    8 => 14,
                    _ => 21
                };

                var aankomst = vandaag.AddDays(offset).Date.AddHours(16);
                var vertrek = aankomst.AddDays(2 + random.Next(2, 5)).AddHours(11);
                var verantwoordelijke = new Verantwoordelijke
                {
                    Naam = naam,
                    Tel = $"04{random.Next(10000000, 99999999)}",
                    Mail = $"{naam.ToLower().Replace(" ", ".")}@voorbeeld.be"
                };

                var periode = new VerhuurPeriode
                {
                    VerhuurderId = verhuurderId,
                    Groep = groep,
                    Verantwoordelijke = verantwoordelijke,
                    Aankomst = aankomst,
                    Vertrek = vertrek,
                    Id = $"{verhuurderId}-{groep.Replace(" ", "")}-{aankomst:yyyyMMddHHmm}"
                };
                periodes.Add(periode);
            }

            return Ok(periodes);
        }
    }
}
