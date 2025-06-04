using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using server.Helpers;
using server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Services
{
    public interface IMediaService
    {
        Task<MediaItem> CreateAsync(MediaItem item);
        Task<List<MediaItem>> GetByUserAsync(string userId);
        Task<MediaItem?> GetByIdAsync(string id);
        Task<bool> DeleteAsync(string id);
    }

    public class MediaService : IMediaService
    {
        private readonly IMongoCollection<MediaItem> _mediaCollection;

        public MediaService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            var db = client.GetDatabase(cfg.Database);
            _mediaCollection = db.GetCollection<MediaItem>(cfg.MediaCollectionName);
        }

        public async Task<MediaItem> CreateAsync(MediaItem item)
        {
            await _mediaCollection.InsertOneAsync(item);
            return item;
        }

        public async Task<List<MediaItem>> GetByUserAsync(string userId)
        {
            return await _mediaCollection.Find(x => x.UserId == userId).ToListAsync();
        }

        public async Task<MediaItem?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var objId))
                return null;
            return await _mediaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var objId))
                return false;
            var filter = Builders<MediaItem>.Filter.Eq(x => x.Id, id);
            var result = await _mediaCollection.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }
    }
}
