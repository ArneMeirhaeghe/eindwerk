// File: Program.cs
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

// 1) CONFIGURATIE BINDEN
builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings"));
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<AzureSettings>(
    builder.Configuration.GetSection("AzureSettings"));

// 2) JWT‐HANDLER EN AUTHENTICATIE CONFIGUREREN
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
        ClockSkew = TimeSpan.FromMinutes(2)
    };
});

// 3) MONGOCLIENT REGISTREREN
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = sp.GetRequiredService<IOptions<MongoSettings>>().Value;
    if (string.IsNullOrWhiteSpace(cfg.ConnectionString))
        throw new InvalidOperationException("MongoSettings:ConnectionString ontbreekt.");
    return new MongoClient(cfg.ConnectionString);
});

// 4) AZURE BLOBSERVICECLIENT REGISTREREN
builder.Services.AddSingleton(sp =>
{
    var azureCfg = sp.GetRequiredService<IOptions<AzureSettings>>().Value;
    if (string.IsNullOrWhiteSpace(azureCfg.ConnectionString))
        throw new InvalidOperationException("AzureSettings:ConnectionString ontbreekt.");
    return new BlobServiceClient(azureCfg.ConnectionString);
});

// 5) EIGEN SERVICES REGISTREREN
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITourService, TourService>();
builder.Services.AddScoped<ILiveSessionService, LiveSessionService>();
builder.Services.AddScoped<IAzureBlobService, AzureBlobService>();
builder.Services.AddScoped<IMediaService, MediaService>();
builder.Services.AddScoped<IFormService, FormService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();

// 6) CORS CONFIGUREREN
builder.Services.AddCors(opts =>
{
    opts.AddPolicy("CorsPolicy", policy =>
        policy.WithOrigins("https://ksainv-frontend.onrender.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// 7) CONTROLLERS, SWAGGER & UPLOAD-LIMIET
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

// 8) ROUTING & SWAGGER UI
app.UseRouting();
app.UseSwagger();
app.UseSwaggerUI();

// 9) APPLY CORS-POLICY
app.UseCors("CorsPolicy");

// 10) AUTHENTICATIE & AUTORISATIE
app.UseAuthentication();
app.UseAuthorization();

// 11) MAP CONTROLLERS
app.MapControllers();

// ─── tijdelijke middleware om OPTIONS preflight te onderscheppen ───
// Verwijder dit blok zodra je ziet dat CORS-headers (Access-Control-Allow-*) werken.
app.Use(async (ctx, next) =>
{
    if (ctx.Request.Method == "OPTIONS")
    {
        ctx.Response.Headers.Add("Access-Control-Allow-Origin", "https://ksainv-frontend.onrender.com");
        ctx.Response.Headers.Add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        ctx.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type,Authorization");
        ctx.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        ctx.Response.StatusCode = 204;
        return;
    }
    await next();
});

// 12) OPTIONELE URL'S (Docker)
app.Urls.Add("http://0.0.0.0:80");

app.Run();
