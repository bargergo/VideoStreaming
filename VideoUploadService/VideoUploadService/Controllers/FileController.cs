using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    }
}
