// File: server/Services/Interfaces/IFormService.cs
using server.Models.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Services.Interfaces
{
    public interface IFormService
    {
        Task<List<Form>> GetAllAsync();                           // Haal alle forms op
        Task<Form?> GetByIdAsync(string id);                      // Haal één form op
        Task<Form> CreateAsync(Form form);                        // Maak nieuw form
        Task UpdateAsync(string id, Form form);                   // Update bestaand form
        Task DeleteAsync(string id);                              // Verwijder form
    }
}
