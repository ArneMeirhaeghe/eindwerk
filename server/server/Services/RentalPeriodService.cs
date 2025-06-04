//// File: Services/RentalPeriodService.cs
//using Microsoft.Extensions.Options;
//using MongoDB.Driver;
//using server.Helpers;
//using server.Models;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace server.Services
//{
//    public class RentalPeriodService
//    {
//        private readonly IMongoCollection<VerhuurPeriode> _rentalCol;

//        public RentalPeriodService(IMongoClient client, IOptions<MongoSettings> opts)
//        {
//            var cfg = opts.Value;
//            var db = client.GetDatabase(cfg.Database);
//            _rentalCol = db.GetCollection<VerhuurPeriode>("RentalPeriods");
//        }

//        // Haal alle verhuurperiodes op
//        public async Task<List<VerhuurPeriode>> GetAllAsync()
//        {
//            return await _rentalCol.Find(_ => true).ToListAsync();
//        }

//        // Haal één verhuurperiode op via Id
//        public async Task<VerhuurPeriode?> GetByIdAsync(string id)
//        {
//            return await _rentalCol.Find(r => r.Id == id).FirstOrDefaultAsync();
//        }

//        // Haal één verhuurperiode op via groepsnaam
//        public async Task<VerhuurPeriode?> GetByGroupAsync(string groep)
//        {
//            var filter = Builders<VerhuurPeriode>.Filter.Eq(r => r.Groep, groep);
//            return await _rentalCol.Find(filter).FirstOrDefaultAsync();
//        }

//        // Maak nieuwe verhuurperiode aan
//        public async Task CreateAsync(VerhuurPeriode rental)
//        {
//            await _rentalCol.InsertOneAsync(rental);
//        }

//        // Update volledige verhuurperiode (PUT)
//        public async Task UpdateAsync(string id, VerhuurPeriode updated)
//        {
//            await _rentalCol.ReplaceOneAsync(r => r.Id == id, updated);
//        }

//        // Patch alleen tourId veld op basis van Id
//        public async Task PatchTourAsync(string id, string tourId)
//        {
//            var update = Builders<VerhuurPeriode>.Update.Set(r => r.TourId, tourId);
//            await _rentalCol.UpdateOneAsync(r => r.Id == id, update);
//        }

//        // Patch tourId op basis van groepsnaam
//        public async Task PatchTourByGroupAsync(string groep, string tourId)
//        {
//            var filter = Builders<VerhuurPeriode>.Filter.Eq(r => r.Groep, groep);
//            var update = Builders<VerhuurPeriode>.Update.Set(r => r.TourId, tourId);
//            await _rentalCol.UpdateOneAsync(filter, update);
//        }

//        // Verwijder verhuurperiode
//        public async Task DeleteAsync(string id)
//        {
//            await _rentalCol.DeleteOneAsync(r => r.Id == id);
//        }
//    }
//}
