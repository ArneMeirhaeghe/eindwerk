using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Microsoft.AspNetCore.Http.Features;
using System.Text;
using server.Helpers;
using server.Services;

var builder = WebApplication.CreateBuilder(args);

// =======================
//  CONFIGURATIE
// =======================
builder.Services.Configure<MongoSettings>(builder.Configuration.GetSection("MongoSettings"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddSingleton<JwtHandler>();

// =======================
//  SERVICES
// =======================
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<EmailService>();

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = builder.Configuration.GetSection("MongoSettings");
    return new MongoClient(cfg["ConnectionString"]);
});

// === form upload limits ===
builder.Services.Configure<FormOptions>(options =>
{
    // onbeperkte grootte of pas aan naar wens
    options.MultipartBodyLengthLimit = long.MaxValue;
});

// controllers, swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =======================
//  JWT AUTH
// =======================
var jwt = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
var key = Encoding.ASCII.GetBytes(jwt.Key);
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
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwt.Issuer,
        ValidateAudience = true,
        ValidAudience = jwt.Audience,
        ClockSkew = TimeSpan.Zero
    };
});

// =======================
//  CORS voor React
// =======================
builder.Services.AddCors(o => o.AddPolicy("CorsPolicy", policy =>
    policy.AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials()
          .WithOrigins("http://localhost:5173")
));

// =======================
//  APP PIPELINE
// =======================
var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// Zorg dat CORS *voor* auth en controllers komt
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Optionele poorten
app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");

app.Run();
