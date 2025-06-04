using System;
using System.IO;
using System.Threading.Tasks;

namespace server.Services
{
    public interface IAzureBlobService
    {
        Task UploadBlobAsync(Stream content, string contentType, string blobName);
        Task DeleteBlobAsync(string blobName);
        Uri GetBlobSasUri(string blobName, int expiryHours);
    }
}
