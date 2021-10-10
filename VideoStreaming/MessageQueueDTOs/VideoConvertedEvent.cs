namespace MessageQueueDTOs
{
    public interface IVideoConvertedEvent
    {
        string FileId { get; }
        string Name { get; }
        string Type { get; }
    }

    public class VideoConvertedEvent : IVideoConvertedEvent
    {
        public string FileId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}
