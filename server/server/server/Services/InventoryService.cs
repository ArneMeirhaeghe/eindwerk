// server/Services/InventoryService.cs
using MongoDB.Bson;
using MongoDB.Driver;
using server.Models;

namespace server.Services
{
    public class InventoryService
    {
        private readonly IMongoCollection<InventorySection> _sections;

        public InventoryService(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDB:ConnectionString"]);
            var db = client.GetDatabase(config["MongoDB:Database"]);
            _sections = db.GetCollection<InventorySection>("InventorySections");
        }

        public async Task<List<InventorySection>> GetAllByUser(string ownerId) =>
            await _sections.Find(s => s.OwnerId == ownerId).ToListAsync();

        public async Task<InventorySection?> GetById(string id)
        {
            if (!ObjectId.TryParse(id, out var oid)) return null;
            return await _sections.Find(s => s.Id == oid.ToString()).FirstOrDefaultAsync();
        }

        public async Task<InventorySection> Create(InventorySection section)
        {
            await _sections.InsertOneAsync(section);
            return section;
        }

        public async Task<bool> Update(string id, InventorySection section)
        {
            if (!ObjectId.TryParse(id, out var oid)) return false;
            section.Id = oid.ToString();
            var result = await _sections.ReplaceOneAsync(s => s.Id == oid.ToString(), section);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> Delete(string id)
        {
            if (!ObjectId.TryParse(id, out var oid)) return false;
            var result = await _sections.DeleteOneAsync(s => s.Id == oid.ToString());
            return result.DeletedCount > 0;
        }
    }
}
