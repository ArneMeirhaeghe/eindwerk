// File: server/Services/Implementations/FormService.cs
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using server.Helpers;
using server.Models.Entities;
using server.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Services.Implementations
{
    public class FormService : IFormService
    {
        private readonly IMongoCollection<Form> _collection;

        public FormService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var settings = opts.Value;
            var database = client.GetDatabase(settings.Database);
            _collection = database.GetCollection<Form>(settings.FormCollectionName);
        }

        public async Task<List<Form>> GetAllAsync() =>
            await _collection.Find(_ => true).ToListAsync();

        public async Task<Form?> GetByIdAsync(string id) =>
            await _collection.Find(f => f.Id == id).FirstOrDefaultAsync();

        public async Task<List<Form>> GetByUserIdAsync(string userId) =>
            await _collection.Find(f => f.UserId == userId).ToListAsync();

        public async Task<Form> CreateAsync(Form form)
        {
            await _collection.InsertOneAsync(form);
            return form;
        }

        public async Task UpdateAsync(string id, Form form) =>
            await _collection.ReplaceOneAsync(f => f.Id == id, form);

        public async Task DeleteAsync(string id) =>
            await _collection.DeleteOneAsync(f => f.Id == id);
    }
}
