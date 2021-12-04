using CatalogService.Database.Entities;
using CatalogService.DTOs;
using CatalogService.Exceptions;
using CatalogService.Extensions;
using CatalogService.Models;
using CatalogService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public async Task<ActionResult<List<Guid>>> CheckVideoIdsForUserList(CheckVideoIdsForUserListParam param)
        {
            var videos = await _catalogService.CheckVideoIdsForUserList(param, User.UserId());
            return videos;
        }

        [HttpGet("list")]
        public async Task<ActionResult<List<VideoInfo>>> GetVideosForUser()
        {
            var videos = await _catalogService.GetVideosForUser(User.UserId());
            return videos.Select(v => new VideoInfo
            {
                Id = v.Id,
                Name = v.Name,
                Description = v.Description,
                Status = v.Status,
                ImageFileName = v.ImageFileName,
                UploadedAt = v.UploadedAt
            }).ToList();
        }

        [HttpPut("list")]
        public async Task<IActionResult> UpdateList(UpdateListParam param)
        {
            await _catalogService.UpdateList(param, User.UserId());
            return Ok();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<GetVideoResult>> GetVideo(Guid id)
        {
            var video = await _catalogService.GetVideoWithProgress(id, User.UserId());
            if (video == null)
            {
                return NotFound();
            }
            return video;
        }

        [HttpPut("{id:guid}/progress")]
        public async Task<IActionResult> UpdateProgress(Guid id, UpdateProgressParam param)
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

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateVideo(Guid id, [FromForm] IFormFile file, [FromForm] string jsonString)
        {
            if (!User.IsAdmin())
            {
                _logger.LogInformation("User is not in admin role, admin rights are required for updating the video.");
                throw new ForbiddenException("User is not in admin role, admin rights are required for updating the video.");
            }
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
            return Ok(new { });
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteVideo(Guid id)
        {
            if (!User.IsAdmin())
            {
                _logger.LogInformation("User is not in admin role, admin rights are required for deleting the video.");
                throw new ForbiddenException("User is not in admin role, admin rights are required for deleting the video.");
            }
            await _catalogService.DeleteVideo(id);
            return NoContent();
        }
    }
}
