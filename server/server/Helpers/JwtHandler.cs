// File: server/Helpers/JwtHandler.cs
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using server.Models;

namespace server.Helpers
{
    public class JwtHandler
    {
        private readonly JwtSettings _settings;

        public JwtHandler(IOptions<JwtSettings> opts) =>
            _settings = opts.Value;

        public string GenerateToken(User user)
        {
            var keyBytes = Encoding.ASCII.GetBytes(_settings.Key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("id", user.Id)
                }),
                Expires = DateTime.UtcNow.AddMinutes(_settings.DurationInMinutes),
                Issuer = _settings.Issuer,
                Audience = _settings.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
