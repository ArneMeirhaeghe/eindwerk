// Services/LiveSessionService.cs
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
        private readonly IMongoCollection<RentalPeriod> _rentalCol;

        public LiveSessionService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;

            var db = client.GetDatabase(cfg.Database);
            _liveCol = db.GetCollection<LiveSession>("LiveSessions");
            _rentalCol = db.GetCollection<RentalPeriod>("RentalPeriods");
        }

        public async Task<LiveSession> StartSessionAsync(string groep, string tourId)
        {
            var session = new LiveSession
            {
                Groep = groep,
                TourId = tourId,
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

        public async Task<int> CreateSessionsForUpcomingAsync()
        {
            var threshold = DateTime.UtcNow.AddDays(14);
            var filterRental = Builders<RentalPeriod>.Filter.Lte(r => r.Aankomst, threshold)
                               & Builders<RentalPeriod>.Filter.Where(r => r.TourId != null);
            var rentals = await _rentalCol.Find(filterRental).ToListAsync();
            int count = 0;

            foreach (var rental in rentals)
            {
                var exists = await _liveCol.Find(s => s.Groep == rental.Groep && s.IsActive).AnyAsync();
                if (!exists)
                {
                    await StartSessionAsync(rental.Groep, rental.TourId);
                    count++;
                }
            }
            return count;
        }
    }
}
