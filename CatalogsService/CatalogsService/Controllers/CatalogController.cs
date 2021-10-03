using CatalogsService.DTOs;
using CatalogsService.Entities;
using CatalogsService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatalogsService.Controllers
{
    [ApiController]
    [Route("api/catalog")]
    public class CatalogController : ControllerBase
    {
        private readonly ILogger<CatalogController> _logger;
        private readonly ICatalogService _catalogService;

        public CatalogController(ILogger<CatalogController> logger, ICatalogService catalogService)
        {
            _logger = logger;
            _catalogService = catalogService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Video>>> GetVideos()
        {
            var videos = await _catalogService.GetVideos();
            return videos;
        }

        [HttpPost]
        public async Task<ActionResult<Video>> CreateVideo(CreateVideoParam param)
        {
            var video = await _catalogService.CreateVideo(param);
            return video;
        }
    }
}
