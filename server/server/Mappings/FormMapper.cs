// File: server/Mappings/FormMapper.cs
using System.Linq;
using server.Models.Entities;
using server.Models.DTOs;
using server.Models.DTOs.Form;

namespace server.Mappings
{
    public static class FormMapper
    {
        public static FormDto ToDto(this Form entity) => new()
        {
            Id = entity.Id,
            Name = entity.Name,
            Fields = entity.Fields.OrderBy(f => f.Order).Select(f => f.ToDto()).ToList()
        };

        public static Form ToEntity(this FormDto dto) => new()
        {
            Id = dto.Id,
            Name = dto.Name,
            Fields = dto.Fields.Select(f => f.ToEntity()).ToList()
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
