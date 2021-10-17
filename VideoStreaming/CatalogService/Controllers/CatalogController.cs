using CatalogService.Database.Entities;
using CatalogService.DTOs;
using CatalogService.Models;
using CatalogService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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
        public async Task<ActionResult<List<Video>>> GetVideos([FromHeader] HeaderParams headerParams)
        {
            var videos = await _catalogService.GetVideos(headerParams.UserId);
            return videos;
        }

        [HttpPost("list/check")]
        public async Task<ActionResult<List<int>>> CheckVideoIdsForUserList(CheckVideoIdsForUserListParam param, [FromHeader] HeaderParams headerParams)
        {
            var videos = await _catalogService.CheckVideoIdsForUserList(param, headerParams.UserId);
            return videos;
        }

        [HttpGet("list")]
        public async Task<ActionResult<List<Video>>> GetVideosForUser([FromHeader] HeaderParams headerParams)
        {
            var videos = await _catalogService.GetVideosForUser(headerParams.UserId);
            return videos;
        }

        [HttpPut("list")]
        public async Task<IActionResult> UpdateList(UpdateListParam param, [FromHeader] HeaderParams headerParams)
        {
            await _catalogService.UpdateList(param, headerParams.UserId);
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetVideoResult>> GetVideo(string id, [FromHeader] HeaderParams headerParams)
        {
            var video = await _catalogService.GetVideoWithProgress(id, headerParams.UserId);
            if (video == null)
            {
                return NotFound();
            }
            return video;
        }

        [HttpPut("{id}/progress")]
        public async Task<IActionResult> UpdateProgress(string id, UpdateProgressParam param, [FromHeader] HeaderParams headerParams)
        {
            var video = await _catalogService.GetVideoWithProgress(id, headerParams.UserId);
            if (video == null)
            {
                return NotFound();
            }
            await _catalogService.UpdateProgress(id, param, headerParams.UserId);
            return Ok();
        }

        [HttpGet("{id}/image")]
        public async Task<FileStreamResult> GetImage(string id)
        {
            var imageHolder = await _catalogService.GetImage(id);
            return File(imageHolder?.Data, "image/jpeg", "image.jpg");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVideo(string id, [FromForm] IFormFile file, [FromForm] string jsonString)
        {
            var allowedContentTypes = new List<string> { "image/jpeg" };
            var allowedExtensions = new List<string> { "jpg" };
            if (file != null)
            {
                var splittedFilename = file.FileName.Split(".");
                if (!allowedContentTypes.Contains(file.ContentType) || !allowedExtensions.Contains(splittedFilename[splittedFilename.Length - 1]))
                {
                    return BadRequest();
                }
            }
            UpdateVideoParam param = JsonConvert.DeserializeObject<UpdateVideoParam>(jsonString);
            var video = await _catalogService.GetVideo(id);
            if (video == null)
            {
                return NotFound();
            }
            await _catalogService.UpdateVideo(id, param, file);
            return Ok();
        }

        [HttpPost("search")]
        public async Task<ActionResult<List<Video>>> SearchVideos(SearchVideoParam param)
        {
            return await _catalogService.Search(param);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideo(string id)
        {
            await _catalogService.DeleteVideo(id);
            return NoContent();
        }

        [HttpGet("{fileId}/{fileName}")]
        public async Task<IActionResult> GetHlsFiles(string fileId, string fileName)
        {
            var video = await _catalogService.GetVideo(fileId);
            if (video == null)
            {
                return NotFound();
            }
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
