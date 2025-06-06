// File: Mappings/TourMapper.cs

using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using server.Models.Entities;

namespace server.Mappings
{
    public static class TourMapper
    {
        /// <summary>
        /// Zet de interne Fases om naar een Dictionary&lt;string, List&lt;SectionDto&gt;&gt; voor API-responses.
        /// </summary>
        public static Dictionary<string, List<SectionDto>> MapFasesToDto(Fases fases)
        {
            var dict = new Dictionary<string, List<SectionDto>>();

            void Map(string naam, List<Section> secties)
            {
                var sectionDtos = secties.Select(sec => new SectionDto
                {
                    Id = sec.Id,
                    Naam = sec.Naam,
                    Components = sec.Components.Select(comp => new ComponentDto
                    {
                        Id = comp.Id,
                        Type = comp.Type,
                        Props = comp.Props
                            .ToDictionary(
                                elem => elem.Name,
                                elem => BsonTypeMapper.MapToDotNetValue(elem.Value)
                            )
                    }).ToList()
                }).ToList();

                if (sectionDtos.Any())
                    dict.Add(naam, sectionDtos);
            }

            Map("voor", fases.Voor);
            Map("aankomst", fases.Aankomst);
            Map("terwijl", fases.Terwijl);
            Map("vertrek", fases.Vertrek);
            Map("na", fases.Na);

            return dict;
        }
    }

    public class SectionDto
    {
        public string Id { get; set; } = null!;
        public string Naam { get; set; } = null!;
        public List<ComponentDto> Components { get; set; } = new();
    }

    public class ComponentDto
    {
        public string Id { get; set; } = null!;
        public string Type { get; set; } = null!;
        public Dictionary<string, object> Props { get; set; } = new();
    }
}
