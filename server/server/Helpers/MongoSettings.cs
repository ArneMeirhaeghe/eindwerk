// File: Helpers/MongoSettings.cs

namespace server.Helpers
{
    public class MongoSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string Database { get; set; } = null!;
        public string MediaCollectionName { get; set; } = "media";
        public string FormCollectionName { get; set; } = null!;
        public string TourCollectionName { get; set; } = "tours";
        public string InventoryTemplatesCollectionName { get; set; } = "inventoryTemplates"; 


    }
}
