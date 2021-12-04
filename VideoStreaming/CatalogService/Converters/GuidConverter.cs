using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace CatalogService.Converters
{
    public sealed class GuidConverter : JsonConverter<Guid>
    {

        public GuidConverter() { }

        public GuidConverter(string format) { _format = format; }

        private readonly string _format = "N";

        public override Guid Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string s = reader.GetString();
            return new Guid(s);
        }

        public override void Write(Utf8JsonWriter writer, Guid value, JsonSerializerOptions options)
        {
            writer.WriteStringValue((value.ToString(_format)));
        }
    }
}
