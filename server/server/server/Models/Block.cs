namespace server.Models
{
    public class Block
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Type { get; set; }
        public string? Content { get; set; }
    }

}
