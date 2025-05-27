using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Microsoft.Extensions.Options;
using server.Helpers;
using System;
using System.IO;
using System.Threading.Tasks;

namespace server.Services
{
    public class AzureBlobService : IAzureBlobService
    {
        private readonly BlobContainerClient _containerClient;
        private readonly AzureSettings _settings;

        public AzureBlobService(BlobServiceClient blobServiceClient, IOptions<AzureSettings> options)
        {
            _settings = options.Value;
            _containerClient = blobServiceClient.GetBlobContainerClient(_settings.ContainerName);
            _containerClient.CreateIfNotExists(PublicAccessType.None);
        }

        public async Task UploadBlobAsync(Stream content, string contentType, string blobName)
        {
            var blob = _containerClient.GetBlobClient(blobName);
            await blob.UploadAsync(content, new BlobHttpHeaders { ContentType = contentType });
        }

        public Uri GetBlobSasUri(string blobName, int expiryHours)
        {
            var blob = _containerClient.GetBlobClient(blobName);
            var sas = new BlobSasBuilder
            {
                BlobContainerName = _settings.ContainerName,
                BlobName = blobName,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddHours(expiryHours)
            };
            sas.SetPermissions(BlobSasPermissions.Read);
            return blob.GenerateSasUri(sas);
        }
        public async Task DeleteBlobAsync(string blobName)
        {
            var blob = _containerClient.GetBlobClient(blobName);
            await blob.DeleteIfExistsAsync();
        }
    }
}
