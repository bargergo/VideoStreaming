namespace VideoUploadService.Models
{
    public interface IFileStorageSettings
    {
        public string DiskStorePath { get; }
        public string UploadUrlPath { get; }
    }

    public class FileStorageSettings : IFileStorageSettings
    {
        public string DiskStorePath { get; set; }
        public string UploadUrlPath { get; set; }
    }
}
