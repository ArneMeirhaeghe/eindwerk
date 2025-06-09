// File: Services/Interfaces/IMediaService.cs

using Microsoft.AspNetCore.Http;
using server.Models.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Services.Interfaces
{
    public interface IMediaService
    {
        Task<MediaItem> CreateAsync(MediaItem item);
        Task<List<MediaItem>> GetByUserAsync(string userId);
        Task<MediaItem?> GetByIdAsync(string id);
        Task<bool> DeleteAsync(string id);
        Task<MediaItem> UploadFileAsync(IFormFile file, string folder, string ownerId);
    }
}
