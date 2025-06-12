// File: server/Mappings/InventoryMapper.cs
using System.Linq;
using server.Models.DTOs.Inventory;
using server.Models.Entities;

namespace server.Mappings
{
    public static class InventoryMapper
    {
        public static InventoryTemplateDto ToDto(InventoryTemplate src) => new()
        {
            Id = src.Id,
            Naam = src.Naam,
            Lokalen = src.Lokalen.Select(l => new LokaalDto
            {
                Name = l.Name,
                Subsections = l.Subsections.Select(s => new SubsectionDto
                {
                    Name = s.Name,
                    Items = s.Items.Select(i => new InventoryItemDto
                    {
                        Name = i.Name,
                        Desired = i.Desired,
                        Actual = i.Actual
                    }).ToList()
                }).ToList()
            }).ToList()
        };

        public static InventoryTemplate FromCreateDto(CreateInventoryTemplateDto dto) => new()
        {
            Naam = dto.Naam,
            Lokalen = dto.Lokalen.Select(l => new Lokaal
            {
                Name = l.Name,
                Subsections = l.Subsections.Select(s => new Subsection
                {
                    Name = s.Name,
                    Items = s.Items.Select(i => new InventoryItem
                    {
                        Name = i.Name,
                        Desired = i.Desired,
                        Actual = i.Actual
                    }).ToList()
                }).ToList()
            }).ToList()
        };

        public static void ApplyUpdate(InventoryTemplate entity, UpdateInventoryTemplateDto dto)
        {
            entity.Naam = dto.Naam;
            entity.Lokalen = dto.Lokalen.Select(l => new Lokaal
            {
                Name = l.Name,
                Subsections = l.Subsections.Select(s => new Subsection
                {
                    Name = s.Name,
                    Items = s.Items.Select(i => new InventoryItem
                    {
                        Name = i.Name,
                        Desired = i.Desired,
                        Actual = i.Actual
                    }).ToList()
                }).ToList()
            }).ToList();
        }
    }
}
