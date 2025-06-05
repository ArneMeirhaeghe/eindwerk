// File: server/Services/LiveSessionService.cs
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using server.Helpers;
using server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Services
{
    public class LiveSessionService
    {
        private readonly IMongoCollection<LiveSession> _liveCol;

        public LiveSessionService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            var db = client.GetDatabase(cfg.Database);
            // Zorg dat de collectie-naam EXACT "livesessions" is
            _liveCol = db.GetCollection<LiveSession>("livesessions");
        }

        /// <summary>
        /// Start een nieuwe live-sessie (groep, tourId, creatorId).
        /// Werpt InvalidOperationException als er al een actieve sessie is 
        /// voor dezelfde groep & creator.
        /// </summary>
        public async Task<LiveSession> StartSessionAsync(string groep, string tourId, string creatorId)
        {
            var existingFilter = Builders<LiveSession>.Filter.And(
                Builders<LiveSession>.Filter.Eq(x => x.Groep, groep),
                Builders<LiveSession>.Filter.Eq(x => x.CreatorId, creatorId),
                Builders<LiveSession>.Filter.Eq(x => x.IsActive, true)
            );
            var already = await _liveCol.Find(existingFilter).FirstOrDefaultAsync();
            if (already != null)
                throw new InvalidOperationException($"Er is al een actieve sessie voor groep '{groep}'.");

            var session = new LiveSession
            {
                Groep = groep,
                TourId = tourId,
                StartDate = DateTime.UtcNow,
                IsActive = true,
                CreatorId = creatorId
            };

            await _liveCol.InsertOneAsync(session);
            return session;
        }

        /// <summary>
        /// Haal alle actieve sessies op voor deze creatorId.
        /// </summary>
        public async Task<List<LiveSession>> GetActiveSessionsAsync(string creatorId)
        {
            var filter = Builders<LiveSession>.Filter.And(
                Builders<LiveSession>.Filter.Eq(x => x.CreatorId, creatorId),
                Builders<LiveSession>.Filter.Eq(x => x.IsActive, true)
            );
            var list = await _liveCol.Find(filter).ToListAsync();
            return list;
        }

        /// <summary>
        /// Haal één sessie op via id.
        /// </summary>
        public async Task<LiveSession?> GetByIdAsync(string id)
        {
            return await _liveCol.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Zet IsActive = false voor deze sessie (eigenaar).
        /// </summary>
        public async Task EndSessionAsync(string id, string creatorId)
        {
            var filter = Builders<LiveSession>.Filter.And(
                Builders<LiveSession>.Filter.Eq(x => x.Id, id),
                Builders<LiveSession>.Filter.Eq(x => x.CreatorId, creatorId)
            );
            var update = Builders<LiveSession>.Update.Set(x => x.IsActive, false);
            var result = await _liveCol.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
                throw new KeyNotFoundException("Live-sessie niet gevonden of geen rechten om te beëindigen.");
        }
    }
}
