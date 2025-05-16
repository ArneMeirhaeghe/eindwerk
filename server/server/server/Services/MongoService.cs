namespace server.Services
{
    using MongoDB.Driver;
    using server.Models;

    public class MongoService
    {
        private readonly IMongoCollection<Plan> _plans;

        public MongoService(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDB:ConnectionString"]);
            var db = client.GetDatabase(config["MongoDB:Database"]);
            _plans = db.GetCollection<Plan>("Plans");
        }

        public async Task<List<Plan>> GetAll() => await _plans.Find(_ => true).ToListAsync();
        public async Task<Plan?> Get(string id) => await _plans.Find(p => p.Id == id).FirstOrDefaultAsync();
        public async Task Create(Plan plan) => await _plans.InsertOneAsync(plan);
        public async Task Update(string id, Plan plan) => await _plans.ReplaceOneAsync(p => p.Id == id, plan);
        public async Task Delete(string id) => await _plans.DeleteOneAsync(p => p.Id == id);
        public async Task<List<Plan>> GetAllByUser(string ownerId) =>
    await _plans.Find(p => p.OwnerId == ownerId).ToListAsync();
        public async Task<Plan?> GetByPublicId(string publicId)
        {
            return await _plans.Find(p => p.PublicId == publicId).FirstOrDefaultAsync();
        }

    }
}
