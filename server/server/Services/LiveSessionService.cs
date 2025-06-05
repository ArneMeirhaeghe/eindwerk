// File: server/Services/LiveSessionService.cs
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using server.Helpers;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Services
{
    public class LiveSessionService
    {
        private readonly IMongoCollection<LiveSession> _liveCol;
        private readonly IMongoCollection<Tour> _tourCol;

        public LiveSessionService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            var db = client.GetDatabase(cfg.Database);
            _liveCol = db.GetCollection<LiveSession>("livesessions");
            _tourCol = db.GetCollection<Tour>("tours");
        }

        /// <summary>
        /// Start een nieuwe live-sessie en sla alle nodige 
        /// fake-API-data + gekozen secties (met componenten) op.
        /// </summary>
        public async Task<LiveSession> StartSessionAsync(
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
            List<string> chosenSectionIds)
        {
            // Controleer op bestaande actieve sessie voor dezelfde groep & creator
            var existingFilter = Builders<LiveSession>.Filter.And(
                Builders<LiveSession>.Filter.Eq(x => x.Groep, groep),
                Builders<LiveSession>.Filter.Eq(x => x.CreatorId, creatorId),
                Builders<LiveSession>.Filter.Eq(x => x.IsActive, true)
            );
            var already = await _liveCol.Find(existingFilter).FirstOrDefaultAsync();
            if (already != null)
                throw new InvalidOperationException($"Er is al een actieve sessie voor groep '{groep}'.");

            // Haal tour op
            var tour = await _tourCol.Find(x => x.Id == tourId).FirstOrDefaultAsync();
            if (tour == null)
                throw new KeyNotFoundException("Tour niet gevonden.");

            // Bouw snapshot dictionary: per fase, lijst van SectionSnapshot
            var snapshotFases = new Dictionary<string, List<SectionSnapshot>>();
            void MapPhase(string faseNaam, List<Section> secties)
            {
                var selected = secties
                    .Where(sec => chosenSectionIds.Contains(sec.Id))
                    .Select(sec => new SectionSnapshot
                    {
                        Id = sec.Id,
                        Naam = sec.Naam,
                        Components = sec.Components
                            .Select(c => new ComponentSnapshot
                            {
                                Id = c.Id,
                                Type = c.Type,
                                Props = c.Props.ToDictionary(
                                    elem => elem.Name,
                                    elem => BsonTypeMapper.MapToDotNetValue(elem.Value)
                                )
                            })
                            .ToList()
                    })
                    .ToList();

                if (selected.Any())
                    snapshotFases[faseNaam] = selected;
            }

            MapPhase("voor", tour.Fases.Voor);
            MapPhase("aankomst", tour.Fases.Aankomst);
            MapPhase("terwijl", tour.Fases.Terwijl);
            MapPhase("vertrek", tour.Fases.Vertrek);
            MapPhase("na", tour.Fases.Na);

            var session = new LiveSession
            {
                VerhuurderId = verhuurderId,
                Groep = groep,
                VerantwoordelijkeNaam = verantwoordelijkeNaam,
                VerantwoordelijkeTel = verantwoordelijkeTel,
                VerantwoordelijkeMail = verantwoordelijkeMail,
                Aankomst = aankomst,
                Vertrek = vertrek,
                TourId = tourId,
                TourName = tourName,
                StartDate = DateTime.UtcNow,
                IsActive = true,
                CreatorId = creatorId,
                Fases = snapshotFases
            };

            await _liveCol.InsertOneAsync(session);
            return session;
        }

        public async Task<List<LiveSession>> GetActiveSessionsAsync(string creatorId)
        {
            var filter = Builders<LiveSession>.Filter.And(
                Builders<LiveSession>.Filter.Eq(x => x.CreatorId, creatorId),
                Builders<LiveSession>.Filter.Eq(x => x.IsActive, true)
            );
            return await _liveCol.Find(filter).ToListAsync();
        }

        public async Task<LiveSession?> GetByIdAsync(string id)
        {
            return await _liveCol.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

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
