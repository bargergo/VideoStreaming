using CatalogService.Database.Entities;
using CatalogService.DTOs;
using CatalogService.Models;
using CatalogService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace CatalogService.Controllers
{
    [ApiController]
    [Route("api/catalog")]
    public class CatalogController : ControllerBase
    {
        private readonly ILogger<CatalogController> _logger;
        private readonly IVideoCatalogService _catalogService;
        private readonly IFileStorageSettings _fileStorageSettings;

        public CatalogController(ILogger<CatalogController> logger, IVideoCatalogService catalogService, IFileStorageSettings fileStorageSettings)
        {
            _logger = logger;
            _catalogService = catalogService;
            _fileStorageSettings = fileStorageSettings;
        }

        [HttpGet]
        public async Task<ActionResult<List<Video>>> GetVideos()
        {
            var videos = await _catalogService.GetVideos();
            return videos;
        }

        /*[HttpPost]
        public async Task<ActionResult<Video>> CreateVideo(CreateVideoParam param)
        {
            var video = await _catalogService.CreateVideo(param);
            return video;
        }*/

        [HttpGet("{fileId}/{fileName}")]
        public IActionResult GetHlsFiles(string fileId, string fileName)
        {
            var pathToFile = Path.Combine(_fileStorageSettings.Path, "hls", fileId, fileName);

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
