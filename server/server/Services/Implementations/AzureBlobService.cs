// File: Services/Implementations/AzureBlobService.cs

using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Microsoft.Extensions.Options;
using server.Helpers;
using server.Services.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;

namespace server.Services.Implementations
{
    public class AzureBlobService : IAzureBlobService
    {
        private readonly BlobContainerClient _containerClient;
        private readonly AzureSettings _settings;

        public AzureBlobService(BlobServiceClient blobServiceClient, IOptions<AzureSettings> opts)
        {
            _settings = opts.Value;
            _containerClient = blobServiceClient.GetBlobContainerClient(_settings.ContainerName);
            _containerClient.CreateIfNotExists(PublicAccessType.None);
        }

        public async Task UploadBlobAsync(Stream content, string contentType, string blobName)
        {
            var blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.UploadAsync(content, new BlobHttpHeaders { ContentType = contentType });
        }

        public async Task DeleteBlobAsync(string blobName)
        {
            var blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.DeleteIfExistsAsync();
        }

        public Uri GetBlobSasUri(string blobName, int expiryHours)
        {
            var blobClient = _containerClient.GetBlobClient(blobName);
            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _settings.ContainerName,
                BlobName = blobName,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddHours(expiryHours)
            };
            sasBuilder.SetPermissions(BlobSasPermissions.Read);
            return blobClient.GenerateSasUri(sasBuilder);
        }
    }
}
