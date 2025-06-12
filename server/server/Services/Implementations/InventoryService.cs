// File: server/Services/Implementations/InventoryService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using server.Helpers;
using server.Models.Entities;
using server.Models.DTOs.Inventory;
using server.Services.Interfaces;
using server.Mappings;

namespace server.Services.Implementations
{
    public class InventoryService : IInventoryService
    {
        private readonly IMongoCollection<InventoryTemplate> _coll;

        public InventoryService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            _coll = client.GetDatabase(cfg.Database)
                          .GetCollection<InventoryTemplate>(cfg.InventoryTemplatesCollectionName);
        }

        public Task<List<InventoryTemplate>> GetAllAsync() =>
            _coll.Find(_ => true).ToListAsync();

        public Task<InventoryTemplate?> GetByIdAsync(string id) =>
            _coll.Find(x => x.Id == id).FirstOrDefaultAsync();

        public Task CreateAsync(InventoryTemplate template) =>
            _coll.InsertOneAsync(template);

        public async Task<bool> UpdateAsync(string id, UpdateInventoryTemplateDto dto)
        {
            var existing = await GetByIdAsync(id);
            if (existing == null) return false;
            InventoryMapper.ApplyUpdate(existing, dto);
            var result = await _coll.ReplaceOneAsync(x => x.Id == id, existing);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _coll.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
