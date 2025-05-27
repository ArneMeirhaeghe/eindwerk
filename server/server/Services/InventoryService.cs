// File: Services/InventoryService.cs
namespace server.Services
{
    using MongoDB.Bson;                     // Voor ObjectId.GenerateNewId()
    using MongoDB.Driver;
    using Microsoft.Extensions.Options;
    using server.Helpers;
    using server.Models;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class InventoryService
    {
        private readonly IMongoCollection<Section> _sections;

        public InventoryService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            var db = client.GetDatabase(cfg.Database);
            _sections = db.GetCollection<Section>("Sections");
        }

        // Secties van de ingelogde user ophalen
        public Task<List<Section>> GetAllSectionsAsync(string userId) =>
            _sections.Find(s => s.UserId == userId).ToListAsync();

        public Task<Section?> GetSectionByIdAsync(string userId, string id) =>
            _sections.Find(s => s.UserId == userId && s.Id == id).FirstOrDefaultAsync();

        public Task<Section> CreateSectionAsync(string userId, Section section)
        {
            section.Id = ObjectId.GenerateNewId().ToString();  // genereer eigen Id
            section.UserId = userId;
            section.Items = new List<Item>();
            return _sections.InsertOneAsync(section)
                             .ContinueWith(_ => section);
        }

        public Task<bool> UpdateSectionAsync(string userId, string id, Section sectionIn) =>
            _sections.ReplaceOneAsync(
                s => s.UserId == userId && s.Id == id,
                sectionIn
            ).ContinueWith(t => t.Result.ModifiedCount > 0);

        public Task<bool> DeleteSectionAsync(string userId, string id) =>
            _sections.DeleteOneAsync(
                s => s.UserId == userId && s.Id == id
            ).ContinueWith(t => t.Result.DeletedCount > 0);

        public async Task<List<Item>> GetItemsAsync(string userId, string sectionId) =>
            (await GetSectionByIdAsync(userId, sectionId))?.Items ?? new List<Item>();

        public async Task<Item?> GetItemAsync(string userId, string sectionId, string itemId) =>
            (await GetSectionByIdAsync(userId, sectionId))?
                .Items.FirstOrDefault(i => i.Id == itemId);

        public async Task<Item> CreateItemAsync(string userId, string sectionId, Item item)
        {
            item.Id = ObjectId.GenerateNewId().ToString();           // genereer nieuw Item-id
            var update = Builders<Section>.Update.Push(s => s.Items, item);
            await _sections.UpdateOneAsync(
                s => s.UserId == userId && s.Id == sectionId,
                update
            );
            return item;
        }

        public Task<bool> UpdateItemAsync(string userId, string sectionId, string itemId, Item upd) =>
            _sections.UpdateOneAsync(
                Builders<Section>.Filter.And(
                    Builders<Section>.Filter.Eq(s => s.UserId, userId),
                    Builders<Section>.Filter.Eq(s => s.Id, sectionId),
                    Builders<Section>.Filter.Eq("items._id", new ObjectId(itemId))
                ),
                Builders<Section>.Update
                    .Set("items.$.name", upd.Name)
                    .Set("items.$.quantity", upd.Quantity)
                    .Set("items.$.lastQuantity", upd.LastQuantity)
            ).ContinueWith(t => t.Result.ModifiedCount > 0);

        public Task<bool> DeleteItemAsync(string userId, string sectionId, string itemId) =>
            _sections.UpdateOneAsync(
                s => s.UserId == userId && s.Id == sectionId,
                Builders<Section>.Update.PullFilter(
                    s => s.Items,
                    i => i.Id == itemId
                )
            ).ContinueWith(t => t.Result.ModifiedCount > 0);
    }
}
