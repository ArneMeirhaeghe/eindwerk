﻿// File: server/Services/Implementations/TourService.cs
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using server.Helpers;               // MongoSettings
using server.Models.Entities;      // Tour, Section, Component, Fases
using server.Services.Interfaces;  // ITourService

namespace server.Services.Implementations
{
    public class TourService : ITourService
    {
        private readonly IMongoCollection<Tour> _tours;

        public TourService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            _tours = client.GetDatabase(cfg.Database)
                            .GetCollection<Tour>(cfg.TourCollectionName); // collectie 'tours' :contentReference[oaicite:1]{index=1}
        }

        public Task<List<Tour>> GetAllAsync() =>
            _tours.Find(_ => true).ToListAsync();

        public Task<Tour?> GetByIdAsync(string id) =>
            _tours.Find(x => x.Id == id).FirstOrDefaultAsync();

        public Task CreateTourAsync(Tour tour) =>
            _tours.InsertOneAsync(tour);

        public Task UpdateTourAsync(string id, Tour updated) =>
            _tours.ReplaceOneAsync(x => x.Id == id, updated);

        public Task DeleteTourAsync(string id) =>
            _tours.DeleteOneAsync(x => x.Id == id);

        public async Task<Section> AddSectionAsync(string tourId, string fase, Section section)
        {
            var filter = Builders<Tour>.Filter.Eq(x => x.Id, tourId);
            var update = Builders<Tour>.Update.Push($"fases.{fase}", section);
            await _tours.UpdateOneAsync(filter, update);
            return section;
        }

        public async Task<bool> UpdateSectionNameAsync(string tourId, string fase, string sectionId, string nieuweNaam)
        {
            var filter = Builders<Tour>.Filter.Eq(x => x.Id, tourId);
            var update = Builders<Tour>.Update.Set($"fases.{fase}.$[sec].naam", nieuweNaam);
            var options = new UpdateOptions
            {
                ArrayFilters = new[] {
                    new BsonDocumentArrayFilterDefinition<Section>(new BsonDocument("sec._id", sectionId))
                }
            };
            var result = await _tours.UpdateOneAsync(filter, update, options);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteSectionAsync(string tourId, string fase, string sectionId)
        {
            var filter = Builders<Tour>.Filter.Eq(x => x.Id, tourId);
            var update = Builders<Tour>.Update.PullFilter(
                $"fases.{fase}",
                Builders<Section>.Filter.Eq(s => s.Id, sectionId)
            );
            var result = await _tours.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task<Component> AddComponentAsync(string tourId, string fase, string sectionId, Component component)
        {
            var filter = Builders<Tour>.Filter.Eq(x => x.Id, tourId);
            var update = Builders<Tour>.Update.Push($"fases.{fase}.$[sec].components", component);
            var options = new UpdateOptions
            {
                ArrayFilters = new[] {
                    new BsonDocumentArrayFilterDefinition<Section>(new BsonDocument("sec._id", sectionId))
                }
            };
            await _tours.UpdateOneAsync(filter, update, options);
            return component;
        }

        public async Task<bool> UpdateComponentAsync(string tourId, string fase, string sectionId, string componentId, BsonDocument nieuweProps, string nieuweType)
        {
            var filter = Builders<Tour>.Filter.Eq(x => x.Id, tourId);
            var update = Builders<Tour>.Update
                .Set($"fases.{fase}.$[sec].components.$[comp].props", nieuweProps)
                .Set($"fases.{fase}.$[sec].components.$[comp].type", nieuweType);
            var options = new UpdateOptions
            {
                ArrayFilters = new ArrayFilterDefinition[] {
                    new BsonDocumentArrayFilterDefinition<Section>(new BsonDocument("sec._id", sectionId)),
                    new BsonDocumentArrayFilterDefinition<Component>(new BsonDocument("comp._id", componentId))
                }
            };
            var result = await _tours.UpdateOneAsync(filter, update, options);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteComponentAsync(string tourId, string fase, string sectionId, string componentId)
        {
            var filter = Builders<Tour>.Filter.Eq(x => x.Id, tourId);
            var update = Builders<Tour>.Update.PullFilter(
                $"fases.{fase}.$[sec].components",
                Builders<Component>.Filter.Eq(c => c.Id, componentId)
            );
            var options = new UpdateOptions
            {
                ArrayFilters = new[] {
                    new BsonDocumentArrayFilterDefinition<Section>(new BsonDocument("sec._id", sectionId))
                }
            };
            var result = await _tours.UpdateOneAsync(filter, update, options);
            return result.ModifiedCount > 0;
        }
    }
}
