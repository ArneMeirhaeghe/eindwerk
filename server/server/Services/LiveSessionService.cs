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
        private readonly TourService _tourService;

        public LiveSessionService(IMongoClient client, IOptions<MongoSettings> opts, TourService tourService)
        {
            var cfg = opts.Value;
            var db = client.GetDatabase(cfg.Database);
            _liveCol = db.GetCollection<LiveSession>("LiveSessions");
            _tourService = tourService;
        }

        public async Task<LiveSession> StartSessionAsync(string groep, string tourId)
        {
            // ► 1) ALTIJD eerst checken of er al een actieve sessie voor deze groep is
            var existingFilter = Builders<LiveSession>.Filter.And(
                Builders<LiveSession>.Filter.Eq(s => s.Groep, groep),
                Builders<LiveSession>.Filter.Eq(s => s.IsActive, true)
            );
            var already = await _liveCol.Find(existingFilter).FirstOrDefaultAsync();
            if (already != null)
            {
                throw new InvalidOperationException($"Er is al een actieve sessie voor groep '{groep}'.");
            }

            // ► 2) Haal de volledige Tour op (of gooi KeyNotFoundException)
            var tour = await _tourService.GetByIdAsync(tourId);
            if (tour is null)
            {
                throw new KeyNotFoundException($"Tour met id '{tourId}' niet gevonden.");
            }

            // ► 3) Maak en insert de nieuwe LiveSession
            var session = new LiveSession
            {
                Groep = groep,
                Tour = tour,
                StartDate = DateTime.UtcNow,
                IsActive = true
            };

            await _liveCol.InsertOneAsync(session);
            return session;
        }

        public async Task<IEnumerable<LiveSession>> GetActiveSessionsAsync()
        {
            var filter = Builders<LiveSession>.Filter.Eq(s => s.IsActive, true);
            return await _liveCol.Find(filter).ToListAsync();
        }

        public async Task<LiveSession?> GetByIdAsync(string id)
        {
            return await _liveCol.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task EndSessionAsync(string id)
        {
            var update = Builders<LiveSession>.Update.Set(s => s.IsActive, false);
            await _liveCol.UpdateOneAsync(s => s.Id == id, update);
        }
    }
}
