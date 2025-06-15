// File: server/Services/Implementations/InventoryService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using server.Models.Entities;
using server.Models.DTOs.Inventory;
using server.Services.Interfaces;
using server.Mappings;
using server.Helpers;

namespace server.Services.Implementations
{
    public class InventoryService : IInventoryService
    {
        private readonly IMongoCollection<InventoryTemplate> _coll;

        public InventoryService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            _coll = client
                .GetDatabase(cfg.Database)
                .GetCollection<InventoryTemplate>(cfg.InventoryTemplatesCollectionName);
        }

        public Task<List<InventoryTemplate>> GetAllAsync(string userId) =>
            // Alleen templates van deze user ophalen
            _coll.Find(x => x.UserId == userId).ToListAsync();

        public Task<InventoryTemplate?> GetByIdAsync(string id, string userId) =>
            // Alleen ophalen als zowel id als eigenaar overeenkomt
            _coll.Find(x => x.Id == id && x.UserId == userId).FirstOrDefaultAsync();

        public Task CreateAsync(InventoryTemplate template, string userId)
        {
            // Zet eigenaar en sla op
            template.UserId = userId;
            return _coll.InsertOneAsync(template);
        }

        public async Task<bool> UpdateAsync(string id, UpdateInventoryTemplateDto dto, string userId)
        {
            var filter = Builders<InventoryTemplate>.Filter
                .Where(x => x.Id == id && x.UserId == userId);

            // Check eerst of de template bestaat voor deze user
            var existing = await _coll.Find(filter).FirstOrDefaultAsync();
            if (existing == null) return false;

            // Pas velden aan
            InventoryMapper.ApplyUpdate(existing, dto);

            // Vervang document
            var result = await _coll.ReplaceOneAsync(filter, existing);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id, string userId)
        {
            // Verwijder alleen als id én eigenaar matchen
            var result = await _coll.DeleteOneAsync(x => x.Id == id && x.UserId == userId);
            return result.DeletedCount > 0;
        }
    }
}
