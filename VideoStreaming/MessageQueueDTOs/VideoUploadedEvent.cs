namespace MessageQueueDTOs
{
    public interface IVideoUploadedEvent
    {
        string FileId { get; }
        string Name { get; }
        string Type { get; }
    }

    public class VideoUploadedEvent : IVideoUploadedEvent
    {
        public string FileId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}
