// File: Services/Interfaces/ITourService.cs

using System.Collections.Generic;
using System.Threading.Tasks;
using server.Models.Entities;

namespace server.Services.Interfaces
{
    public interface ITourService
    {
        Task<List<Tour>> GetAllAsync();
        Task<Tour?> GetByIdAsync(string id);
        Task CreateTourAsync(Tour tour);
        Task UpdateTourAsync(string id, Tour updated);
        Task DeleteTourAsync(string id);
        Task<Section> AddSectionAsync(string tourId, string fase, Section section);
        Task<bool> UpdateSectionNameAsync(string tourId, string fase, string sectionId, string nieuweNaam);
        Task<bool> DeleteSectionAsync(string tourId, string fase, string sectionId);
        Task<Component> AddComponentAsync(string tourId, string fase, string sectionId, Component component);
        Task<bool> UpdateComponentAsync(string tourId, string fase, string sectionId, string componentId, MongoDB.Bson.BsonDocument nieuweProps, string nieuweType);
        Task<bool> DeleteComponentAsync(string tourId, string fase, string sectionId, string componentId);
    }
}
