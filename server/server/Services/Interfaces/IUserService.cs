using System.Collections.Generic;
using System.Threading.Tasks;
using server.Models.Entities;

namespace server.Services.Interfaces
{
    public interface IUserService
    {
        // Gebruiker valideren bij login
        Task<User?> ValidateUserAsync(string email, string password);

        // Gebruiker opzoeken op e-mail
        Task<User?> GetByEmailAsync(string email);

        // Nieuwe gebruiker aanmaken
        Task<User> CreateUserAsync(string email, string password, string role = "User");

        // Alle gebruikers ophalen
        Task<List<User>> GetAllAsync();

        // Gebruiker ophalen op id
        Task<User?> GetByIdAsync(string id);

        // Gebruiker updaten (email, role, etc.)
        Task UpdateAsync(User user);

        // Gebruiker verwijderen
        Task DeleteAsync(string id);
    }
}
