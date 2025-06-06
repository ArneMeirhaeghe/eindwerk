// File: Models/DTOs/LiveSession/StartSessionDto.cs
using System;
using System.Collections.Generic;

namespace server.Models.DTOs.LiveSession
{
    public class StartSessionDto
    {
        public string VerhuurderId { get; set; } = null!;
        public string Groep { get; set; } = null!;
        public string VerantwoordelijkeNaam { get; set; } = null!;
        public string VerantwoordelijkeTel { get; set; } = null!;
        public string VerantwoordelijkeMail { get; set; } = null!;
        public DateTime Aankomst { get; set; }
        public DateTime Vertrek { get; set; }
        public string TourId { get; set; } = null!;
        public string TourName { get; set; } = null!;
        public List<string> SectionIds { get; set; } = new();
    }
}
