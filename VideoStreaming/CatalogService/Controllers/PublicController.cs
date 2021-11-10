using CatalogService.Database.Entities;
using CatalogService.DTOs;
using CatalogService.Extensions;
using CatalogService.Models;
using CatalogService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace CatalogService.Controllers
{
    [ApiController]
    [Route("api/catalog/public")]
    public class PublicController : ControllerBase
    {
        private readonly ILogger<PublicController> _logger;
        private readonly IVideoCatalogService _catalogService;
        private readonly IFileStorageSettings _fileStorageSettings;

        public PublicController(ILogger<PublicController> logger, IVideoCatalogService catalogService, IFileStorageSettings fileStorageSettings)
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

        [HttpGet("{id}")]
        public async Task<ActionResult<GetVideoResult>> GetVideo(string id)
        {
            var video = await _catalogService.GetVideo(id);
            if (video == null)
            {
                return NotFound();
            }
            return new GetVideoResult
            {
                Id = video.Id,
                FileId = video.FileId,
                Name = video.Name,
                Description = video.Description,
                Status = video.Status,
                ImageFileName = video.ImageFileName,
                UploadedAt = video.UploadedAt
            };
        }

        [HttpGet("{id}/image")]
        public async Task<FileStreamResult> GetImage(string id)
        {
            var imageHolder = await _catalogService.GetImage(id);
            return File(imageHolder?.Data, "image/jpeg", "image.jpg");
        }

        [HttpPost("search")]
        public async Task<ActionResult<List<Video>>> SearchVideos(SearchVideoParam param)
        {
            return await _catalogService.Search(param);
        }

        [HttpGet("{fileId}/{fileName}")]
        public async Task<IActionResult> GetHlsFiles(string fileId, string fileName)
        {
            _logger.LogInformation($"Get file {fileId}/{fileName}");
            var video = await _catalogService.GetVideo(fileId);
            if (video == null)
            {
                _logger.LogInformation($"Video with id: {fileId} not found");
                return NotFound();
            }
            var pathToFile = Path.Combine(_fileStorageSettings.Path, "hls", fileId, fileName);
            _logger.LogInformation($"Path to file: {pathToFile}");

            var supportedExtensions = new List<string>
            {
                ".ts",
                ".m3u8"
            };

            var extension = fileName.Substring(fileName.LastIndexOf("."));
            try
            {
                if (!System.IO.File.Exists(pathToFile) || !supportedExtensions.Contains(extension))
                {
                    if (!System.IO.File.Exists(pathToFile))
                    {
                        _logger.LogInformation($"File does not exist: {pathToFile}");
                    } else
                    {
                        _logger.LogInformation($"Forbidden extension: {extension}");
                    }
                    return NotFound($"File was not found.");
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
            }


            var contentType = extension == ".ts"
                ? "video/mp2t"
                : "application/x-mpegURL";

            _logger.LogInformation($"Opening file for read: {pathToFile}");
            var file = System.IO.File.OpenRead(pathToFile);
            _logger.LogInformation($"Opened file for read: {pathToFile}");
            return File(file, contentType, fileName);
        }
    }
}
