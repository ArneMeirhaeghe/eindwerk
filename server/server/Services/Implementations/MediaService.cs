// File: Services/Implementations/MediaService.cs

using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using server.Helpers;
using server.Models.Entities;
using server.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace server.Services.Implementations
{
    public class MediaService : IMediaService
    {
        private readonly IMongoCollection<MediaItem> _mediaCollection;
        private readonly BlobContainerClient _blobContainer;
        private readonly AzureSettings _azureSettings;

        public MediaService(
       IMongoClient client,
       IOptions<MongoSettings> mongoOpts,
       IOptions<AzureSettings> azureOpts,
       BlobServiceClient blobServiceClient)
        {
            var mongoCfg = mongoOpts.Value;
            var db = client.GetDatabase(mongoCfg.Database);
            _mediaCollection = db.GetCollection<MediaItem>(mongoCfg.MediaCollectionName);

            var azureCfg = azureOpts.Value;
            _azureSettings = azureCfg;
            _blobContainer = blobServiceClient.GetBlobContainerClient(azureCfg.ContainerName);

            // Maak de container aan zonder publieke toegang (PublicAccessType.None)
            _blobContainer.CreateIfNotExists(PublicAccessType.None);
        }

        public async Task<MediaItem> CreateAsync(MediaItem item)
        {
            await _mediaCollection.InsertOneAsync(item);
            return item;
        }

        public async Task<List<MediaItem>> GetByUserAsync(string userId)
        {
            return await _mediaCollection.Find(x => x.UserId == userId).ToListAsync();
        }

        public async Task<MediaItem?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return null;
            return await _mediaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return false;

            var filter = Builders<MediaItem>.Filter.Eq(x => x.Id, id);
            var toDelete = await _mediaCollection.Find(filter).FirstOrDefaultAsync();
            if (toDelete == null) return false;

            var blobClient = _blobContainer.GetBlobClient(toDelete.BlobName);
            await blobClient.DeleteIfExistsAsync();

            var result = await _mediaCollection.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }

        public async Task<MediaItem> UploadFileAsync(IFormFile file, string folder)
        {
            var originalFileName = Path.GetFileName(file.FileName);
            var uniqueName = $"{Guid.NewGuid()}_{originalFileName}";
            var blobName = $"{folder}/{uniqueName}";

            var blobClient = _blobContainer.GetBlobClient(blobName);
            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, new BlobHttpHeaders
                {
                    ContentType = file.ContentType
                });
            }

            var mediaItem = new MediaItem
            {
                BlobName = blobName,
                FileName = originalFileName,
                ContentType = file.ContentType,
                Alt = originalFileName,
                Styles = string.Empty,
                UserId = "", // wordt in controller gezet
                Timestamp = DateTime.UtcNow,
                Url = blobClient.Uri.ToString() // sla directe URL op
            };
            await _mediaCollection.InsertOneAsync(mediaItem);

            return mediaItem;
        }
    }
}
