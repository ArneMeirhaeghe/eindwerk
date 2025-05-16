// server/Services/UserService.cs
using MongoDB.Bson;
using MongoDB.Driver;
using server.Models;
using server.Models.DTOs;

namespace server.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IConfiguration config)
    {
        var client = new MongoClient(config["MongoDB:ConnectionString"]);
        var db = client.GetDatabase(config["MongoDB:Database"]);
        _users = db.GetCollection<User>("Users");
    }

    public async Task<bool> EmailExists(string email) =>
        await _users.Find(u => u.Email == email).AnyAsync();

    public async Task<User?> GetByEmail(string email) =>
        await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

    public async Task<bool> ValidateCredentials(string email, string plainPassword)
    {
        var user = await GetByEmail(email);
        if (user == null) return false;
        return BCrypt.Net.BCrypt.Verify(plainPassword, user.PasswordHash);
    }

    public async Task<User> Register(string email, string password, string role)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User { Email = email, PasswordHash = hash, Role = role };
        await _users.InsertOneAsync(user);
        return user;
    }

    public async Task<List<User>> GetAll() =>
        await _users.Find(_ => true).ToListAsync();

    public async Task<User?> GetById(string id)
    {
        if (!ObjectId.TryParse(id, out var oid))
            throw new FormatException("Ongeldig ID-formaat");
        return await _users.Find(u => u.Id == oid.ToString()).FirstOrDefaultAsync();
    }

    public async Task<bool> Update(string id, UserUpdateRequest req)
    {
        if (!ObjectId.TryParse(id, out var oid))
            throw new FormatException("Ongeldig ID-formaat");

        var update = Builders<User>.Update.Set(u => u.Role, req.Role ?? "user");
        var result = await _users.UpdateOneAsync(u => u.Id == oid.ToString(), update);
        return result.ModifiedCount > 0;
    }

    public async Task Delete(string id)
    {
        if (!ObjectId.TryParse(id, out var oid))
            throw new FormatException("Ongeldig ID-formaat");
        await _users.DeleteOneAsync(u => u.Id == oid.ToString());
    }
}
