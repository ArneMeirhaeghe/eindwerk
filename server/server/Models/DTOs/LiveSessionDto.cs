// File: Models/LiveSessionDto.cs
namespace server.Models
{
    public class LiveSessionDto
    {
        public string Id { get; set; } = null!;
        public string Groep { get; set; } = null!;
        public string? TourId { get; set; }
        public string? TourNaam { get; set; }
        public DateTime StartDate { get; set; }
        public bool IsActive { get; set; }
    }
}
