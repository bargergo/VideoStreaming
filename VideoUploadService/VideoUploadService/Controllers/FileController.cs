using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using tusdotnet.Stores;
using VideoUploadService.Models;

namespace VideoUploadService.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileStorageSettings _fileStorageSettings;

        public FileController(IFileStorageSettings fileStorageSettings)
        {
            _fileStorageSettings = fileStorageSettings;
        }

        [HttpGet("{fileId}")]
        public async Task<IActionResult> Get(string fileId, CancellationToken cancellationToken)
        {
            var store = new TusDiskStore(_fileStorageSettings.DiskStorePath);
            var file = await store.GetFileAsync(fileId, cancellationToken);

            if (file == null)
            {
                return NotFound($"File with id {fileId} was not found.");
            }

            var fileStream = await file.GetContentAsync(cancellationToken);
            var metadata = await file.GetMetadataAsync(cancellationToken);

            var contentType = metadata.ContainsKey("filetype")
                    ? metadata["filetype"].GetString(Encoding.UTF8)
                    : "application/octet-stream";

            var filename = metadata.ContainsKey("filename")
                ? metadata["filename"].GetString(Encoding.UTF8)
                : fileId;
            return File(fileStream, contentType, filename);
        }

        [HttpGet("{fileId}/{fileName}")]
        public IActionResult GetHlsFiles(string fileId, string fileName, CancellationToken cancellationToken)
        {
            var pathToFile = Path.Combine(_fileStorageSettings.DiskStorePath, "hls", fileId, fileName);

            var supportedExtensions = new List<string>
            {
                ".ts",
                ".m3u8"
            };

            var extension = fileName.Substring(fileName.LastIndexOf("."));

            if (!System.IO.File.Exists(pathToFile) || !supportedExtensions.Contains(extension))
            {
                return NotFound($"File was not found.");
            }


            var contentType = extension == ".ts"
                ? "video/mp2t"
                : "application/x-mpegURL";

            var file = System.IO.File.OpenRead(pathToFile);
            return File(file, contentType, fileName);
        }
    }
}
