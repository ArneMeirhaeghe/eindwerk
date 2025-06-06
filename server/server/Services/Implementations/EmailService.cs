// File: Services/Implementations/EmailService.cs

using System.Threading.Tasks;

namespace server.Services.Implementations
{
    public class EmailService
    {
        public Task SendEmailVerificationAsync(string email, string link)
        {
            // Stub: implement actual email sending logic
            return Task.CompletedTask;
        }

        public Task SendPasswordResetAsync(string email, string link)
        {
            // Stub: implement actual email sending logic
            return Task.CompletedTask;
        }
    }
}
