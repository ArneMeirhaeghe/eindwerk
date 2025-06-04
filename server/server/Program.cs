// File: Program.cs
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using server.Helpers;
using server.Services;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1) User‐secrets (alleen in Development)
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

// 2) Lees settings uit
builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings"));
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<AzureSettings>(
    builder.Configuration.GetSection("AzureSettings"));

// 3) JWT-handler + Authentication
builder.Services.AddSingleton<JwtHandler>();
var jwtConfig = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
var key = Encoding.ASCII.GetBytes(jwtConfig.Key);
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
        ValidIssuer = jwtConfig.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtConfig.Audience,
        ClockSkew = TimeSpan.Zero
    };
});

// 4) Mongo‐client registreren
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = sp.GetRequiredService<IOptions<MongoSettings>>().Value;
    if (string.IsNullOrWhiteSpace(cfg.ConnectionString))
        throw new InvalidOperationException("MongoSettings:ConnectionString is niet geconfigureerd.");
    return new MongoClient(cfg.ConnectionString);
});

// 5) Registreer alle services in de juiste volgorde:
builder.Services.AddSingleton<UserService>();       // indien je AuthController hebt
builder.Services.AddSingleton<EmailService>();      // indien nodig
builder.Services.AddSingleton<InventoryService>();  // indien nodig

builder.Services.AddSingleton<TourService>();            // <— eerst TourService
builder.Services.AddSingleton<LiveSessionService>();     // <— daarna LiveSessionService (injecteert TourService)

// 6) Azure Blob Storage (optioneel)
builder.Services.AddSingleton<IMediaService, MediaService>();
builder.Services.AddSingleton(sp =>
{
    var azure = sp.GetRequiredService<IOptions<AzureSettings>>().Value;
    if (string.IsNullOrWhiteSpace(azure.ConnectionString))
        throw new InvalidOperationException("AzureSettings:ConnectionString is niet geconfigureerd.");
    return new BlobServiceClient(azure.ConnectionString);
});
builder.Services.AddSingleton<IAzureBlobService, AzureBlobService>();

// 7) Upload limits
builder.Services.Configure<FormOptions>(opts =>
    opts.MultipartBodyLengthLimit = long.MaxValue);

// 8) Controllers, Swagger & CORS
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

// Middleware‐pipeline
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Optionele poorten voor lokale ontwikkeling
app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");

app.Run();
