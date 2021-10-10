namespace UploadService.Models
{
    public interface IMessageQueueSettings
    {
        public string Hostname { get; }
        public string Username { get; }
        public string Password { get; }
    }

    public class MessageQueueSettings : IMessageQueueSettings
    {
        public string Hostname { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
