namespace ConvertService.Services
{
    public interface IFileStorageSettings
    {
        string Path { get; }
    }

    public class FileStorageSettings : IFileStorageSettings
    {
        public string Path { get; set; }
    }
}
