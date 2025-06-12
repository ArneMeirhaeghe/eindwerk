// File: server/Services/Interfaces/IFormService.cs
using server.Models.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Services.Interfaces
{
    public interface IFormService
    {
        Task<List<Form>> GetAllAsync();                             // Alle forms
        Task<Form?> GetByIdAsync(string id);                        // Eén form
        Task<List<Form>> GetByUserIdAsync(string userId);           // Forms per user
        Task<Form> CreateAsync(Form form);                          // Nieuw form
        Task UpdateAsync(string id, Form form);                     // Bestaand form updaten
        Task DeleteAsync(string id);                                // Form verwijderen
    }
}
