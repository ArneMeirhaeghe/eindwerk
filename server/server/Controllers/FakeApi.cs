using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FakeApi : ControllerBase
    {
        [HttpGet("verhuurperiodes")]
        public IActionResult GetVerhuurperiodes()
        {
            var verhuurderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (verhuurderId == null)
                return Unauthorized("Geen verhuurder ID gevonden");

            var periodes = new[]
            {
                new {
                    verhuurderId = "68306d860e718fe3903c0467",
                    groep = "KSA Deinze",
                    verantwoordelijke = new {
                        naam = "Lotte Peeters",
                        tel = "0498 12 34 56",
                        mail = "lotte@voorbeeld.be"
                    },
                    aankomst = new DateTime(2025, 6, 14, 17, 0, 0),
                    vertrek = new DateTime(2025, 6, 16, 11, 0, 0)
                },
                new {
                    verhuurderId = "68306d860e718fe3903c0467",
                    groep = "KSA Oudenaarde",
                    verantwoordelijke = new {
                        naam = "Tom Van Damme",
                        tel = "0472 55 44 33",
                        mail = "tom@voorbeeld.be"
                    },
                    aankomst = new DateTime(2025, 7, 1, 18, 30, 0),
                    vertrek = new DateTime(2025, 7, 3, 10, 0, 0)
                },
                new {
                    verhuurderId = "68306d860e718fe3903c0467",
                    groep = "KSA Zottegem",
                    verantwoordelijke = new {
                        naam = "Elien De Smet",
                        tel = "0466 11 22 33",
                        mail = "elien@voorbeeld.be"
                    },
                    aankomst = new DateTime(2025, 8, 10, 16, 0, 0),
                    vertrek = new DateTime(2025, 8, 12, 11, 0, 0)
                },
                new {
                    verhuurderId = "user456",
                    groep = "KSA Brugge",
                    verantwoordelijke = new {
                        naam = "Jens Vandenberghe",
                        tel = "0489 88 77 66",
                        mail = "jens@voorbeeld.be"
                    },
                    aankomst = new DateTime(2025, 6, 21, 16, 0, 0),
                    vertrek = new DateTime(2025, 6, 23, 12, 0, 0)
                }
            };

            var sessiesVoorUser = periodes.Where(p => p.verhuurderId == verhuurderId);
            return Ok(sessiesVoorUser);
        }
    }
}
