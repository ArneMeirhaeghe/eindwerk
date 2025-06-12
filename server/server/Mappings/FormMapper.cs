// File: server/Mappings/FormMapper.cs
using System.Linq;
using server.Models.Entities;
using server.Models.DTOs.Form;

namespace server.Mappings
{
    public static class FormMapper
    {
        public static FormDto ToDto(this Form e) => new()
        {
            Id = e.Id,
            Name = e.Name,
            UserId = e.UserId,                                      // userId includen
            Fields = e.Fields
                      .OrderBy(f => f.Order)
                      .Select(f => f.ToDto())
                      .ToList()
        };

        public static Form ToEntity(this FormDto d) => new()
        {
            Id = d.Id,
            Name = d.Name,
            UserId = d.UserId,                                      // userId includen
            Fields = d.Fields.Select(f => f.ToEntity()).ToList()
        };

        private static FieldDto ToDto(this Field f) => new()
        {
            Id = f.Id,
            Type = f.Type,
            Label = f.Label,
            Settings = f.Settings,
            Order = f.Order
        };

        private static Field ToEntity(this FieldDto d) => new()
        {
            Id = d.Id,
            Type = d.Type,
            Label = d.Label,
            Settings = d.Settings,
            Order = d.Order
        };
    }
}
