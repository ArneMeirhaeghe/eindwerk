// File: server/Helpers/BsonStringToBoolJsonConverter.cs

using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using MongoDB.Bson;

public class BsonStringToBoolJsonConverter : JsonConverter<object>
{
    public override bool CanConvert(Type typeToConvert)
    {
        return typeof(BsonValue).IsAssignableFrom(typeToConvert);
    }

    public override object Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        // Voor nu niet nodig, we hoeven voornamelijk schrijven
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, object value, JsonSerializerOptions options)
    {
        switch (value)
        {
            // 2a) BsonDocument → serialiseer als object met alle elementen
            case BsonDocument bd:
                writer.WriteStartObject();
                foreach (var element in bd)
                {
                    writer.WritePropertyName(element.Name);
                    Write(writer, element.Value, options);  // recursief voor BsonValue-kinderen
                }
                writer.WriteEndObject();
                break;

            // 2b) Alle andere BsonValue-types
            case BsonValue bv:
                switch (bv.BsonType)
                {
                    case BsonType.Boolean:
                        writer.WriteBooleanValue(bv.AsBoolean);
                        return;
                    case BsonType.Int32:
                        writer.WriteNumberValue(bv.AsInt32);
                        return;
                    case BsonType.Double:
                        writer.WriteNumberValue(bv.AsDouble);
                        return;
                    case BsonType.String:
                        var s = bv.AsString;
                        if (bool.TryParse(s, out var b))
                            writer.WriteBooleanValue(b);
                        else
                            writer.WriteStringValue(s);
                        return;
                    case BsonType.Array:
                        writer.WriteStartArray();
                        foreach (var item in bv.AsBsonArray)
                        {
                            Write(writer, item, options); // recursief
                        }
                        writer.WriteEndArray();
                        return;
                    case BsonType.Document:
                        // Deze tak wordt iets dubbel gedekt (BsonDocument is ook BsonValue),
                        // maar dit toont hetzelfde als de BsonDocument-case hierboven.
                        var nested = bv.AsBsonDocument;
                        writer.WriteStartObject();
                        foreach (var el in nested)
                        {
                            writer.WritePropertyName(el.Name);
                            Write(writer, el.Value, options);
                        }
                        writer.WriteEndObject();
                        return;
                    default:
                        // Andere BsonTypes (Int64, DateTime, oid, etc.) → schrijf als string (fallback)
                        writer.WriteStringValue(bv.ToString());
                        return;
                }

            // 2c) Voor **niet-**BsonValue komen we hier nooit, want CanConvert pakt enkel BsonValue
            default:
                // (Optioneel) gooi: nooit verwacht dat deze branch aan de beurt komt
                throw new JsonException($"Onverwacht type in Bson-converter: {value.GetType()}");
        }
    }
}
