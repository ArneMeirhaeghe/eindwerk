// File: Program.cs
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using server.Helpers;    // MongoSettings, JwtSettings, AzureSettings
using server.Services;   // InventoryService, UserService, EmailService, MediaService, AzureBlobService
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1) LAAD USER-SECRETS ALLEEN IN DEVELOPMENT
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

// 2) CONFIGURATIE (leest zowel appsettings.json als secrets.json)
builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings"));
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<AzureSettings>(
    builder.Configuration.GetSection("AzureSettings"));

// 3) JWT HANDLER + AUTH
builder.Services.AddSingleton<JwtHandler>();
var jwt = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
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

// 4) DI VOOR JE SERVICES
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddSingleton<InventoryService>();
builder.Services.AddSingleton<LiveSessionService>();


// 5) MONGO-CLIENT
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = sp.GetRequiredService<IOptions<MongoSettings>>().Value;
    if (string.IsNullOrWhiteSpace(cfg.ConnectionString))
        throw new InvalidOperationException("MongoSettings:ConnectionString is niet geconfigureerd.");
    return new MongoClient(cfg.ConnectionString);
});

// 6) AZURE BLOB STORAGE
builder.Services.AddSingleton<IMediaService, MediaService>();
builder.Services.AddSingleton(sp =>
{
    var azure = sp.GetRequiredService<IOptions<AzureSettings>>().Value;
    if (string.IsNullOrWhiteSpace(azure.ConnectionString))
        throw new InvalidOperationException("AzureSettings:ConnectionString is niet geconfigureerd.");
    return new BlobServiceClient(azure.ConnectionString);
});
builder.Services.AddSingleton<IAzureBlobService, AzureBlobService>();

// 7) UPLOAD LIMITS
builder.Services.Configure<FormOptions>(opts =>
    opts.MultipartBodyLengthLimit = long.MaxValue);

// 8) CONTROLLERS, SWAGGER & CORS
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

// MIDDLEWARE PIPELINE
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Optionele poorten
app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");

app.Run();
