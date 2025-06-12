// File: server/Models/Entities/Subsection.cs
using System.Collections.Generic;

namespace server.Models.Entities
{
    public class Subsection
    {
        public string Name { get; set; } = null!;
        public List<InventoryItem> Items { get; set; } = new();
    }
}
