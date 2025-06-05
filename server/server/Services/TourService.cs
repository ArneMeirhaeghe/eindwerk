using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using server.Helpers;
using server.Models;

namespace server.Services
{
    public class TourService
    {
        private readonly IMongoCollection<Tour> _tours;

        public TourService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            var db = client.GetDatabase(cfg.Database);
            _tours = db.GetCollection<Tour>("tours");
        }

        // ---- Tour CRUD ----  
        public async Task<Tour?> GetByIdAsync(string id)
        {
            return await _tours.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateTourAsync(Tour tour)
        {
            await _tours.InsertOneAsync(tour);
        }

        public async Task UpdateTourAsync(string id, Tour updated)
        {
            await _tours.ReplaceOneAsync(x => x.Id == id, updated);
        }

        public async Task DeleteTourAsync(string id)
        {
            await _tours.DeleteOneAsync(x => x.Id == id);
        }
        public async Task<List<Tour>> GetAllAsync()
        {
            return await _tours.Find(_ => true).ToListAsync();
        }
        // ---- Section CRUD binnen een fase ----  
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

            var arrayFilters = new List<ArrayFilterDefinition>
            {
                new BsonDocumentArrayFilterDefinition<Section>(new BsonDocument("sec._id", sectionId))
            };
            var options = new UpdateOptions { ArrayFilters = arrayFilters };

            var result = await _tours.UpdateOneAsync(filter, update, options);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteSectionAsync(string tourId, string fase, string sectionId)
        {
            var filter = Builders<Tour>.Filter.Eq(x => x.Id, tourId);
            var update = Builders<Tour>.Update.PullFilter($"fases.{fase}", Builders<Section>.Filter.Eq(s => s.Id, sectionId));
            var result = await _tours.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        // ---- Component CRUD binnen een section ----  
        public async Task<Component> AddComponentAsync(string tourId, string fase, string sectionId, Component component)
        {
            var filter = Builders<Tour>.Filter.Eq(x => x.Id, tourId);
            var update = Builders<Tour>.Update.Push($"fases.{fase}.$[sec].components", component);

            var arrayFilters = new List<ArrayFilterDefinition>
            {
                new BsonDocumentArrayFilterDefinition<Section>(new BsonDocument("sec._id", sectionId))
            };
            var options = new UpdateOptions { ArrayFilters = arrayFilters };

            await _tours.UpdateOneAsync(filter, update, options);
            return component;
        }

        public async Task<bool> UpdateComponentAsync(string tourId, string fase, string sectionId, string componentId, BsonDocument nieuweProps, string nieuweType)
        {
            var filter = Builders<Tour>.Filter.Eq(x => x.Id, tourId);
            var update = Builders<Tour>.Update
                .Set($"fases.{fase}.$[sec].components.$[comp].props", nieuweProps)
                .Set($"fases.{fase}.$[sec].components.$[comp].type", nieuweType);

            var arrayFilters = new List<ArrayFilterDefinition>
            {
                new BsonDocumentArrayFilterDefinition<Section>(new BsonDocument("sec._id", sectionId)),
                new BsonDocumentArrayFilterDefinition<Component>(new BsonDocument("comp._id", componentId))
            };
            var options = new UpdateOptions { ArrayFilters = arrayFilters };

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

            var arrayFilters = new List<ArrayFilterDefinition>
            {
                new BsonDocumentArrayFilterDefinition<Section>(new BsonDocument("sec._id", sectionId))
            };
            var options = new UpdateOptions { ArrayFilters = arrayFilters };

            var result = await _tours.UpdateOneAsync(filter, update, options);
            return result.ModifiedCount > 0;
        }
    }
}
