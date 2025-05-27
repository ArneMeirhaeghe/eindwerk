// File: Program.cs
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using server.Helpers;           // MongoSettings
using server.Services;          // InventoryService, UserService, EmailService, MediaService, AzureBlobService
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =======================
//  CONFIGURATIE
// =======================
builder.Services.Configure<MongoSettings>(                // MongoDB settings (connection + database)
    builder.Configuration.GetSection("MongoSettings"));
builder.Services.Configure<JwtSettings>(                   // JWT settings
    builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<AzureSettings>(                 // Azure Blob Storage instellingen
    builder.Configuration.GetSection("AzureSettings"));

// =======================
//  JWT HANDLER + AUTH
// =======================
builder.Services.AddSingleton<JwtHandler>();
var jwt = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
var key = Encoding.ASCII.GetBytes(jwt.Key);
builder.Services.AddAuthentication(opts =>
{
    opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opts =>
{
    opts.RequireHttpsMetadata = false;
    opts.SaveToken = true;
    opts.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwt.Issuer,
        ValidateAudience = true,
        ValidAudience = jwt.Audience,
        ClockSkew = TimeSpan.Zero
    };
});

// =======================
//  JE EIGEN SERVICES
// =======================
builder.Services.AddSingleton<UserService>();             // User CRUD
builder.Services.AddSingleton<EmailService>();            // E-mail functionaliteit
builder.Services.AddSingleton<InventoryService>();        // Inventory (sections + items)

// ==== MongoDB Client =====
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = sp.GetRequiredService<IOptions<MongoSettings>>().Value;
    return new MongoClient(cfg.ConnectionString);
});

// ==== MediaService & AzureBlobService ====
builder.Services.AddSingleton<IMediaService, MediaService>();
builder.Services.AddSingleton(sp =>
    new BlobServiceClient(builder.Configuration["AzureSettings:ConnectionString"]));
builder.Services.AddSingleton<IAzureBlobService, AzureBlobService>();

// === form upload limits ===
builder.Services.Configure<FormOptions>(opts =>
    opts.MultipartBodyLengthLimit = long.MaxValue);

// === Controllers, Swagger & CORS ===
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy("CorsPolicy", p =>
    p.AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()
     .WithOrigins("http://localhost:5173")
));

var app = builder.Build();

// =======================
//  MIDDLEWARE PIPELINE
// =======================
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("CorsPolicy");       // vóór auth
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();            // InventoryController en overige controllers

// Optionele poorten (HTTP + HTTPS)
app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");

app.Run();
