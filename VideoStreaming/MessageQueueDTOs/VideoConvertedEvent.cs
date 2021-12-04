using System;

namespace MessageQueueDTOs
{
    public interface IVideoConvertedEvent
    {
        Guid FileId { get; }
        string Name { get; }
        string Type { get; }
    }

    public class VideoConvertedEvent : IVideoConvertedEvent
    {
        public Guid FileId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}
