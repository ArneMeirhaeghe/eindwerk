// File: Models/Entities/VerhuurPeriode.cs

using System;

namespace server.Models.Entities
{
    public class VerhuurPeriode
    {
        public string Id { get; set; } = null!;
        public string VerhuurderId { get; set; } = null!;
        public string Groep { get; set; } = null!;
        public Verantwoordelijke Verantwoordelijke { get; set; } = null!;
        public DateTime Aankomst { get; set; }
        public DateTime Vertrek { get; set; }
    }
}
