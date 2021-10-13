using CatalogService.Database;
using CatalogService.Database.Entities;
using CatalogService.DTOs;
using CatalogService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace CatalogService.Services
{
    public class VideoCatalogService : IVideoCatalogService
    {
        private readonly CatalogDbContext _catalogDb;
        private readonly IFileStorageSettings _fileStorageSettings;

        public VideoCatalogService(CatalogDbContext catalogDb, IFileStorageSettings fileStorageSettings)
        {
            _catalogDb = catalogDb;
            _fileStorageSettings = fileStorageSettings;
        }

        public async Task<Video> CreateVideo(Video param)
        {
            await _catalogDb.Videos.AddAsync(param);
            await _catalogDb.SaveChangesAsync();
            return param;
        }

        public async Task DeleteVideo(string id)
        {
            var video = await _catalogDb.Videos.FirstOrDefaultAsync(v => v.FileId == id);
            if (video != null)
            {
                var dir = new DirectoryInfo(_fileStorageSettings.Path);

                foreach (var file in dir.EnumerateFiles(id + ".*"))
                {
                    file.Delete();
                }
                var hlsDir = new DirectoryInfo(Path.Combine(_fileStorageSettings.Path, "hls", id));
                if (hlsDir.Exists)
                {
                    hlsDir.Delete(true);
                }
                _catalogDb.Remove(video);
                await _catalogDb.SaveChangesAsync();
            }
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

        public async Task UpdateVideo(string id, UpdateVideoParam param)
        {
            var video = await _catalogDb.Videos.FirstOrDefaultAsync(v => v.FileId == id);
            video.Name = param.Title;
            video.Description = param.Description;
            await _catalogDb.SaveChangesAsync();
        }
    }
}
