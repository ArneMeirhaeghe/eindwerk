// File: server/Services/Interfaces/IInventoryService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using server.Models.DTOs.Inventory;
using server.Models.Entities;

namespace server.Services.Interfaces
{
    public interface IInventoryService
    {
        // Haal alle templates op voor een specifieke user
        Task<List<InventoryTemplate>> GetAllAsync(string userId);

        // Haal één template op op basis van id én eigenaarschap
        Task<InventoryTemplate?> GetByIdAsync(string id, string userId);

        // Maak een nieuwe template aan voor de opgegeven user
        Task CreateAsync(InventoryTemplate template, string userId);

        // Werk een bestaande template bij, mits userId matcht
        Task<bool> UpdateAsync(string id, UpdateInventoryTemplateDto dto, string userId);

        // Verwijder een template, mits userId matcht
        Task<bool> DeleteAsync(string id, string userId);
    }
}
