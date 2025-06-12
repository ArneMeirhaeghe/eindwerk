// File: server/Models/Entities/Lokaal.cs
using System.Collections.Generic;

namespace server.Models.Entities
{
    public class Lokaal
    {
        public string Name { get; set; } = null!;
        public List<Subsection> Subsections { get; set; } = new();
    }
}
