// File: Controllers/FakeApiController.cs

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models.Entities;
using System;
using System.Linq;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Vereist JWT-authenticatie
    public class FakeApiController : ControllerBase
    {
        // GET api/FakeApi/verhuurperiodes
        [HttpGet("verhuurperiodes")]
        public IActionResult GetVerhuurperiodes()
        {
            // Haal verhuurderId uit JWT-claim (NameIdentifier)
            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (verhuurderId == null)
                return Unauthorized("Geen verhuurder ID gevonden");

            // Hardcoded voorbeeldgegevens
            var periodes = new[]
            {
                new VerhuurPeriode
                {
                    VerhuurderId = "6840172f906bbdfe78d5e838",
                    Groep = "KSA Deinze",
                    Verantwoordelijke = new Verantwoordelijke
                    {
                        Naam = "Lotte Peeters",
                        Tel = "0498 12 34 56",
                        Mail = "lotte@voorbeeld.be"
                    },
                    Aankomst = new DateTime(2025, 6, 14, 17, 0, 0),
                    Vertrek = new DateTime(2025, 6, 16, 11, 0, 0)
                },
                new VerhuurPeriode
                {
                    VerhuurderId = "6842c63f444e6395df35c550",
                    Groep = "KSA Oudenaarde",
                    Verantwoordelijke = new Verantwoordelijke
                    {
                        Naam = "Tom Van Damme",
                        Tel = "0472 55 44 33",
                        Mail = "tom@voorbeeld.be"
                    },
                    Aankomst = new DateTime(2025, 7, 1, 18, 30, 0),
                    Vertrek = new DateTime(2025, 7, 3, 10, 0, 0)
                },
                new VerhuurPeriode
                {
                    VerhuurderId = "6842c63f444e6395df35c550",
                    Groep = "KSA Zottegem",
                    Verantwoordelijke = new Verantwoordelijke
                    {
                        Naam = "Elien De Smet",
                        Tel = "0466 11 22 33",
                        Mail = "elien@voorbeeld.be"
                    },
                    Aankomst = new DateTime(2025, 8, 10, 16, 0, 0),
                    Vertrek = new DateTime(2025, 8, 12, 11, 0, 0)
                },
                new VerhuurPeriode
                {
                    VerhuurderId = "6842c63f444e6395df35c550",
                    Groep = "KSA Brugge",
                    Verantwoordelijke = new Verantwoordelijke
                    {
                        Naam = "Jens Vandenberghe",
                        Tel = "0489 88 77 66",
                        Mail = "jens@voorbeeld.be"
                    },
                    Aankomst = new DateTime(2025, 6, 21, 16, 0, 0),
                    Vertrek = new DateTime(2025, 6, 23, 12, 0, 0)
                }
            };

            // Filter periodes op verhuurderId
            var sessiesVoorUser = periodes
                .Where(p => p.VerhuurderId == verhuurderId)
                .Select(p =>
                {
                    // Bouw unieke ID als combinatie van verhuurderId, groep en aankomst
                    p.Id = $"{p.VerhuurderId}-{p.Groep.Replace(" ", "")}-{p.Aankomst:yyyyMMddHHmm}";
                    return p;
                })
                .ToList();

            return Ok(sessiesVoorUser);
        }
    }
}
