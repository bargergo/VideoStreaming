using System;

namespace MessageQueueDTOs
{
    public interface IVideoUploadedEvent
    {
        Guid FileId { get; }
        string Name { get; }
        string Type { get; }
    }

    public class VideoUploadedEvent : IVideoUploadedEvent
    {
        public Guid FileId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}
