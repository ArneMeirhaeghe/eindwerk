// File: server/Models/VerhuurPeriode.cs
namespace server.Models
{
    public class VerhuurPeriode
    {
        // Unieke ID opgebouwd uit verhuurderId, groep en aankomsttijd
        public string Id { get; set; } = null!;
        public string VerhuurderId { get; set; } = null!;
        public string Groep { get; set; } = null!;
        public Verantwoordelijke Verantwoordelijke { get; set; } = null!;
        public DateTime Aankomst { get; set; }
        public DateTime Vertrek { get; set; }
    }

    public class Verantwoordelijke
    {
        public string Naam { get; set; } = null!;
        public string Tel { get; set; } = null!;
        public string Mail { get; set; } = null!;
    }
}
