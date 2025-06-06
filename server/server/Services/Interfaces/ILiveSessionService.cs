// File: Services/Interfaces/ILiveSessionService.cs

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using server.Models.Entities;

namespace server.Services.Interfaces
{
    public interface ILiveSessionService
    {
        Task<LiveSession> StartSessionAsync(
            string verhuurderId,
            string groep,
            string verantwoordelijkeNaam,
            string verantwoordelijkeTel,
            string verantwoordelijkeMail,
            DateTime aankomst,
            DateTime vertrek,
            string tourId,
            string tourName,
            string creatorId,
            List<string> chosenSectionIds);

        Task<List<LiveSession>> GetActiveSessionsAsync(string creatorId);
        Task<LiveSession?> GetByIdAsync(string id);
        Task EndSessionAsync(string id, string creatorId);
        Task AddOrUpdateResponseAsync(string sessionId, string fieldId, object value);
        Task UpdateResponsesBulkAsync(string sessionId, Dictionary<string, object> newResponses);
    }
}
