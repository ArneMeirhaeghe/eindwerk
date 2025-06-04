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
            _liveCol = db.GetCollection<LiveSession>("livesessions");
        }

        public async Task<LiveSession> StartSessionAsync(string groep, string tourId, string creatorId)
        {
            var existingFilter = Builders<LiveSession>.Filter.And(
                Builders<LiveSession>.Filter.Eq(s => s.Groep, groep),
                Builders<LiveSession>.Filter.Eq(s => s.CreatorId, creatorId),
                Builders<LiveSession>.Filter.Eq(s => s.IsActive, true)
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

        public async Task<IEnumerable<LiveSession>> GetActiveSessionsAsync(string creatorId)
        {
            var filter = Builders<LiveSession>.Filter.And(
                Builders<LiveSession>.Filter.Eq(s => s.CreatorId, creatorId),
                Builders<LiveSession>.Filter.Eq(s => s.IsActive, true)
            );
            return await _liveCol.Find(filter).ToListAsync();
        }

        public async Task<LiveSession?> GetByIdAsync(string id)
        {
            return await _liveCol.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task EndSessionAsync(string id, string creatorId)
        {
            var filter = Builders<LiveSession>.Filter.And(
                Builders<LiveSession>.Filter.Eq(s => s.Id, id),
                Builders<LiveSession>.Filter.Eq(s => s.CreatorId, creatorId)
            );
            var update = Builders<LiveSession>.Update.Set(s => s.IsActive, false);
            var result = await _liveCol.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
                throw new KeyNotFoundException("Live-sessie niet gevonden of geen rechten om te beëindigen.");
        }
    }
}
