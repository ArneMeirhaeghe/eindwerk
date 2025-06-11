using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Azure.Storage.Blobs;
using MongoDB.Driver;
using server.Helpers;
using server.Services.Interfaces;
using server.Services.Implementations;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// -----------------------------------------------------
// 1) CONFIGURATIE BINDEN
// -----------------------------------------------------
builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings"));

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

builder.Services.Configure<AzureSettings>(
    builder.Configuration.GetSection("AzureSettings"));

// -----------------------------------------------------
// 2) JWT‐HANDLER EN AUTHENTICATIE CONFIGUREREN
// -----------------------------------------------------
builder.Services.AddSingleton<JwtHandler>();
var jwtConfig = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
var keyBytes = Encoding.ASCII.GetBytes(jwtConfig.Key);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = true,
        ValidIssuer = jwtConfig.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtConfig.Audience,
        ClockSkew = TimeSpan.FromMinutes(2) // 2min tolerantie
    };
});

// -----------------------------------------------------
// 3) MONGOCLIENT REGISTREREN
// -----------------------------------------------------
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = sp.GetRequiredService<IOptions<MongoSettings>>().Value;
    if (string.IsNullOrWhiteSpace(cfg.ConnectionString))
        throw new InvalidOperationException("MongoSettings:ConnectionString ontbreekt.");
    return new MongoClient(cfg.ConnectionString);
});

// -----------------------------------------------------
// 4) AZURE BLOBSERVICECLIENT REGISTREREN
// -----------------------------------------------------
builder.Services.AddSingleton(sp =>
{
    var azureCfg = sp.GetRequiredService<IOptions<AzureSettings>>().Value;
    if (string.IsNullOrWhiteSpace(azureCfg.ConnectionString))
        throw new InvalidOperationException("AzureSettings:ConnectionString ontbreekt.");
    return new BlobServiceClient(azureCfg.ConnectionString);
});

// -----------------------------------------------------
// 5) EIGEN SERVICES REGISTREREN
// -----------------------------------------------------
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITourService, TourService>();
builder.Services.AddScoped<ILiveSessionService, LiveSessionService>();
builder.Services.AddScoped<IAzureBlobService, AzureBlobService>();
builder.Services.AddScoped<IMediaService, MediaService>();
builder.Services.AddScoped<IFormService, FormService>();    // ← FormService

// -----------------------------------------------------
// 6) CORS CONFIGUREREN
// -----------------------------------------------------
builder.Services.AddCors(opts =>
{
    opts.AddPolicy("CorsPolicy", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// -----------------------------------------------------
// 7) CONTROLLERS, SWAGGER & UPLOAD-LIMIET
// -----------------------------------------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        options.JsonSerializerOptions.Converters.Add(new BsonStringToBoolJsonConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<FormOptions>(opts =>
{
    opts.MultipartBodyLengthLimit = long.MaxValue;
});

var app = builder.Build();

// -----------------------------------------------------
// 8) SWAGGER UI
// -----------------------------------------------------
app.UseSwagger();
app.UseSwaggerUI();

// -----------------------------------------------------
// 9) CORS VÓÓR AUTHENTICATIE
// -----------------------------------------------------
app.UseCors("CorsPolicy");

// -----------------------------------------------------
// 10) AUTHENTICATIE & AUTORISATIE
// -----------------------------------------------------
app.UseAuthentication();
app.UseAuthorization();

// -----------------------------------------------------
// 11) MAP CONTROLLERS
// -----------------------------------------------------
app.MapControllers();

// -----------------------------------------------------
// 12) OPTIONELE URL'S
// -----------------------------------------------------
app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");

app.Run();
