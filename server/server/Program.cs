// File: server/Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Azure.Storage.Blobs;
using server.Helpers;
using server.Services;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1) Configuratie‐secties binden
builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings"));
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<AzureSettings>(
    builder.Configuration.GetSection("AzureSettings"));

// 2) JWT‐handler registreren
builder.Services.AddSingleton<JwtHandler>();
var jwtConfig = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
var keyBytes = Encoding.ASCII.GetBytes(jwtConfig.Key);

// 3) JWT‐authenticatie configureren
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
        ClockSkew = TimeSpan.Zero
    };
});

// 4) MongoClient registreren
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = sp.GetRequiredService<IOptions<MongoSettings>>().Value;
    if (string.IsNullOrWhiteSpace(cfg.ConnectionString))
        throw new InvalidOperationException("MongoSettings:ConnectionString ontbreekt.");
    return new MongoClient(cfg.ConnectionString);
});

// 5) Azure BlobServiceClient registreren
builder.Services.AddSingleton(sp =>
{
    var azureCfg = sp.GetRequiredService<IOptions<AzureSettings>>().Value;
    if (string.IsNullOrWhiteSpace(azureCfg.ConnectionString))
        throw new InvalidOperationException("AzureSettings:ConnectionString ontbreekt.");
    return new BlobServiceClient(azureCfg.ConnectionString);
});
builder.Services.AddSingleton<IAzureBlobService, AzureBlobService>();

// 6) Register overige services
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddSingleton<TourService>();
builder.Services.AddSingleton<LiveSessionService>();
builder.Services.AddSingleton<IMediaService, MediaService>();

// 7) CORS configureren
builder.Services.AddCors(opts =>
{
    opts.AddPolicy("CorsPolicy", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// 8) Controllers, Swagger en upload-limiet
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<FormOptions>(opts =>
{
    opts.MultipartBodyLengthLimit = long.MaxValue;
});

var app = builder.Build();

// 9) Swagger UI
app.UseSwagger();
app.UseSwaggerUI();

// 10) CORS vóór authentication
app.UseCors("CorsPolicy");

// 11) JWT‐authenticatie en -autorisatie
app.UseAuthentication();
app.UseAuthorization();

// 12) Map controllers
app.MapControllers();

// 13) Optionele URL’s
app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");

app.Run();
