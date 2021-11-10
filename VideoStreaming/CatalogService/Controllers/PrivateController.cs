using CatalogService.Database.Entities;
using CatalogService.DTOs;
using CatalogService.Extensions;
using CatalogService.Models;
using CatalogService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CatalogService.Controllers
{
    [Route("api/catalog/private")]
    [ApiController]
    public class PrivateController : ControllerBase
    {
        private readonly ILogger<PrivateController> _logger;
        private readonly IVideoCatalogService _catalogService;
        private readonly IFileStorageSettings _fileStorageSettings;

        public PrivateController(ILogger<PrivateController> logger, IVideoCatalogService catalogService, IFileStorageSettings fileStorageSettings)
        {
            _logger = logger;
            _catalogService = catalogService;
            _fileStorageSettings = fileStorageSettings;
        }

        [HttpPost("list/check")]
        public async Task<ActionResult<List<int>>> CheckVideoIdsForUserList(CheckVideoIdsForUserListParam param)
        {
            var videos = await _catalogService.CheckVideoIdsForUserList(param, User.UserId());
            return videos;
        }

        [HttpGet("list")]
        public async Task<ActionResult<List<Video>>> GetVideosForUser()
        {
            var videos = await _catalogService.GetVideosForUser(User.UserId());
            return videos;
        }

        [HttpPut("list")]
        public async Task<IActionResult> UpdateList(UpdateListParam param)
        {
            await _catalogService.UpdateList(param, User.UserId());
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetVideoResult>> GetVideo(string id)
        {
            var video = await _catalogService.GetVideoWithProgress(id, User.UserId());
            if (video == null)
            {
                return NotFound();
            }
            return video;
        }

        [HttpPut("{id}/progress")]
        public async Task<IActionResult> UpdateProgress(string id, UpdateProgressParam param)
        {
            var userId = User.UserId();
            var video = await _catalogService.GetVideoWithProgress(id, userId);
            if (video == null)
            {
                return NotFound();
            }
            await _catalogService.UpdateProgress(id, param, userId);
            return Ok();
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideo(string id)
        {
            await _catalogService.DeleteVideo(id);
            return NoContent();
        }
    }
}
