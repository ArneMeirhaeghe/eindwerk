using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using server.Helpers;
using server.Models.Entities;
using server.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace server.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IMongoClient client, IOptions<MongoSettings> opts)
        {
            var cfg = opts.Value;
            var db = client.GetDatabase(cfg.Database);
            _users = db.GetCollection<User>("users");
        }

        public async Task<User?> ValidateUserAsync(string email, string password)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);
            var user = await _users.Find(filter).FirstOrDefaultAsync();
            if (user == null) return null;

            // Wachtwoord controleren (hashed met BCrypt)
            return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash) ? user : null;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);
            return await _users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User> CreateUserAsync(string email, string password, string role = "User")
        {
            var hash = BCrypt.Net.BCrypt.HashPassword(password);
            var user = new User
            {
                Email = email,
                PasswordHash = hash,
                Role = role,
                IsEmailVerified = false
            };
            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _users.Find(_ => true).ToListAsync();
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _)) return null;
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            return await _users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(User user)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
            // Updaten van email en role (en eventuele andere velden die gewijzigd zijn)
            var update = Builders<User>.Update
                .Set(u => u.Email, user.Email)
                .Set(u => u.Role, user.Role)
                .Set(u => u.IsEmailVerified, user.IsEmailVerified);
            await _users.UpdateOneAsync(filter, update);
        }

        public async Task DeleteAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _)) return;
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            await _users.DeleteOneAsync(filter);
        }
    }
}
