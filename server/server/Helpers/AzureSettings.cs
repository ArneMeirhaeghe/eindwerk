namespace server.Helpers
{
    public class AzureSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string ContainerName { get; set; } = null!;
        public int SasExpiryHours { get; set; } = 24;
    }
}
