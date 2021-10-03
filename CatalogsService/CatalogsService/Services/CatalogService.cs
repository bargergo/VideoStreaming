using CatalogsService.Database;
using CatalogsService.DTOs;
using CatalogsService.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatalogsService.Services
{
    public class CatalogService : ICatalogService
    {
        private readonly CatalogDbContext _catalogDb;

        public CatalogService(CatalogDbContext catalogDb)
        {
            _catalogDb = catalogDb;
        }

        public async Task<Video> CreateVideo(CreateVideoParam param)
        {
            var video = new Video { FileId = param.FileId, Name = param.Name };
            await _catalogDb.Videos.AddAsync(video);
            await _catalogDb.SaveChangesAsync();
            return video;
        }

        public async Task<List<Video>> GetVideos()
        {
            var videos = await _catalogDb.Videos.ToListAsync();
            return videos;
        }
    }
}
