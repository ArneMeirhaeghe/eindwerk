// File: Services/TourService.cs
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using server.Helpers;
using server.Models;
using System.Threading.Tasks;

namespace server.Services
{
    public class TourService
    {
        private readonly IMongoCollection<Tour> _tourCol;

        public TourService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            var db = client.GetDatabase(cfg.Database);
            _tourCol = db.GetCollection<Tour>("tours");
        }

        public async Task<Tour?> GetByIdAsync(string id)
        {
            return await _tourCol.Find(t => t.Id == id).FirstOrDefaultAsync();
        }
    }
}
