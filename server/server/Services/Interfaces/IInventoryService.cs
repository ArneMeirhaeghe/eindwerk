// File: server/Services/Interfaces/IInventoryService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using server.Models.DTOs.Inventory;
using server.Models.Entities;

namespace server.Services.Interfaces
{
    public interface IInventoryService
    {
        Task<List<InventoryTemplate>> GetAllAsync();
        Task<InventoryTemplate?> GetByIdAsync(string id);
        Task CreateAsync(InventoryTemplate template);
        Task<bool> UpdateAsync(string id, UpdateInventoryTemplateDto dto);
        Task<bool> DeleteAsync(string id);
    }
}
