namespace MessageQueueDTOs
{
    public interface IVideoUploadedForCatalogEvent
    {
        string FileId { get; }
        string Name { get; }
        string Type { get; }
    }

    public class VideoUploadedForCatalogEvent : IVideoUploadedForCatalogEvent
    {
        public string FileId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}
