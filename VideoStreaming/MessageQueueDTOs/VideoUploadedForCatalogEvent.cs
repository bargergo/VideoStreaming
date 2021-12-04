using System;

namespace MessageQueueDTOs
{
    public interface IVideoUploadedForCatalogEvent
    {
        Guid FileId { get; }
        string Name { get; }
        string Type { get; }
    }

    public class VideoUploadedForCatalogEvent : IVideoUploadedForCatalogEvent
    {
        public Guid FileId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}
