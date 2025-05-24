namespace server.Services;

// placeholder voor SMTP/SendGrid integratie
public class EmailService
{
    public Task SendEmailVerificationAsync(string to, string link)
        => Task.CompletedTask;

    public Task SendPasswordResetAsync(string to, string link)
        => Task.CompletedTask;
}
