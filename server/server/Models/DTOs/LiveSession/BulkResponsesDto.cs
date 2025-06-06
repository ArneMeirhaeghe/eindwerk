// File: Models/DTOs/LiveSession/BulkResponsesDto.cs
using System.Collections.Generic;

namespace server.Models.DTOs.LiveSession
{
    public class BulkResponsesDto
    {
        public Dictionary<string, object> Responses { get; set; } = new();
    }
}
