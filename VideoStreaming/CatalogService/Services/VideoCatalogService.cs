using CatalogService.Database;
using CatalogService.Database.Entities;
using CatalogService.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CatalogService.Services
{
    public class VideoCatalogService : IVideoCatalogService
    {
        private readonly CatalogDbContext _catalogDb;

        public VideoCatalogService(CatalogDbContext catalogDb)
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
