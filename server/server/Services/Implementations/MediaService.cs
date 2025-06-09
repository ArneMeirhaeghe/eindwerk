// File: Services/Implementations/MediaService.cs

using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
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

        public MediaService(
            IMongoClient client,
            IOptions<MongoSettings> mongoOpts,
            IOptions<AzureSettings> azureOpts,
            BlobServiceClient blobServiceClient)
        {
            var db = client.GetDatabase(mongoOpts.Value.Database);
            _mediaCollection = db.GetCollection<MediaItem>(mongoOpts.Value.MediaCollectionName);

            _blobContainer = blobServiceClient.GetBlobContainerClient(azureOpts.Value.ContainerName);
            _blobContainer.CreateIfNotExists(PublicAccessType.None);
        }

        // Insert een bestaand MediaItem
        public async Task<MediaItem> CreateAsync(MediaItem item)
        {
            await _mediaCollection.InsertOneAsync(item);
            return item;
        }

        // Haal alle media-items op voor een gegeven userId (hier ownerId=sessionId)
        public async Task<List<MediaItem>> GetByUserAsync(string userId)
        {
            return await _mediaCollection
                .Find(x => x.UserId == userId)
                .ToListAsync();
        }

        // Haal één media-item op via de MongoDB ObjectId
        public async Task<MediaItem?> GetByIdAsync(string id)
        {
            if (!MongoDB.Bson.ObjectId.TryParse(id, out _))
                return null;
            return await _mediaCollection
                .Find(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        // Verwijder een media-item én blob
        public async Task<bool> DeleteAsync(string id)
        {
            if (!MongoDB.Bson.ObjectId.TryParse(id, out _))
                return false;

            var toDelete = await _mediaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
            if (toDelete == null)
                return false;

            var blobClient = _blobContainer.GetBlobClient(toDelete.BlobName);
            await blobClient.DeleteIfExistsAsync();

            var result = await _mediaCollection.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount > 0;
        }

        // Upload en creëer een MediaItem met ownerId=sessionId (geldige ObjectId)
        public async Task<MediaItem> UploadFileAsync(IFormFile file, string folder, string ownerId)
        {
            var originalFileName = Path.GetFileName(file.FileName);
            var uniqueName = $"{Guid.NewGuid()}_{originalFileName}";
            var blobName = $"{folder}/{uniqueName}";

            var blobClient = _blobContainer.GetBlobClient(blobName);
            await using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, new BlobHttpHeaders
            {
                ContentType = file.ContentType
            });

            var mediaItem = new MediaItem
            {
                BlobName = blobName,
                FileName = originalFileName,
                ContentType = file.ContentType,
                Alt = originalFileName,
                Styles = string.Empty,
                UserId = ownerId,
                Timestamp = DateTime.UtcNow,
                Url = blobClient.Uri.ToString()
            };

            await _mediaCollection.InsertOneAsync(mediaItem);
            return mediaItem;
        }
    }
}
