// File: server/Services/EmailService.cs
using System.Threading.Tasks;

namespace server.Services
{
    // Placeholder service for email functionality (e.g., SMTP or SendGrid)
    public class EmailService
    {
        public Task SendEmailVerificationAsync(string to, string link) =>
            Task.CompletedTask;

        public Task SendPasswordResetAsync(string to, string link) =>
            Task.CompletedTask;
    }
}
