// File: server/Services/UserService.cs
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using server.Models;
using server.Helpers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IOptions<MongoSettings> opts)
        {
            var client = new MongoClient(opts.Value.ConnectionString);
            var db = client.GetDatabase(opts.Value.Database);
            _users = db.GetCollection<User>("Users");
        }

        public async Task<User> CreateAsync(string email, string password, string role = "User")
        {
            var user = new User
            {
                Email = email,
                Role = role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                CreatedAt = DateTime.UtcNow
            };

            await _users.InsertOneAsync(user);
            return user;
        }

        public Task<User> GetByEmailAsync(string email) =>
            _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public Task<User> GetByIdAsync(string id) =>
            _users.Find(u => u.Id == id).FirstOrDefaultAsync();

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            var list = await _users.Find(_ => true).ToListAsync();
            return list.AsEnumerable();
        }

        public Task UpdateAsync(User u) =>
            _users.ReplaceOneAsync(x => x.Id == u.Id, u);

        public Task DeleteAsync(string id) =>
            _users.DeleteOneAsync(u => u.Id == id);
    }
}
