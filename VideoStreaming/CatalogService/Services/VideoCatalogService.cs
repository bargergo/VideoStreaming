using CatalogService.Database;
using CatalogService.Database.Entities;
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

        public async Task<Video> CreateVideo(Video param)
        {
            await _catalogDb.Videos.AddAsync(param);
            await _catalogDb.SaveChangesAsync();
            return param;
        }

        public async Task<Video> GetVideo(string id)
        {
            return await _catalogDb.Videos.FirstOrDefaultAsync(v => v.FileId == id);
        }

        public async Task<List<Video>> GetVideos()
        {
            var videos = await _catalogDb.Videos.ToListAsync();
            return videos;
        }
    }
}
