using CatalogService.Database;
using CatalogService.Database.Entities;
using CatalogService.DTOs;
using CatalogService.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
            await _catalogDb.Videos.AddAsync(new Video
            {
                FileId = param.FileId,
                Name = param.Name,
                Status = param.Status,
                UploadedAt = DateTime.Now
            });
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
                if (video.ImageFileName != null)
                {
                    var imgDirectoryPath = Path.Combine(_fileStorageSettings.Path, "images");
                    var imgDirectory = new DirectoryInfo(imgDirectoryPath);
                    if (!imgDirectory.Exists)
                    {
                        imgDirectory.Create();
                    }
                    foreach (var oldFile in imgDirectory.EnumerateFiles(id + ".*"))
                    {
                        oldFile.Delete();
                    }
                }
                _catalogDb.Remove(video);
                await _catalogDb.SaveChangesAsync();
            }
        }

        public async Task<ImageHolder> GetImage(string id)
        {
            var video = await _catalogDb.Videos.FirstOrDefaultAsync(v => v.FileId == id);
            if (video != null && video.ImageFileName != null)
            {
                var imgPath = Path.Combine(_fileStorageSettings.Path, "images", video.ImageFileName);
                var fileInfo = new FileInfo(imgPath);
                if (fileInfo.Exists)
                {
                    return new ImageHolder
                    {
                        Data = File.OpenRead(imgPath),
                        Filename = video.ImageFileName,
                        ContentType = fileInfo.Extension
                    };
                }
            }
            return null;
        }

        public async Task<Video> GetVideo(string id)
        {
            return await _catalogDb.Videos
                .FirstOrDefaultAsync(v => v.FileId == id);
        }

        public async Task<GetVideoResult> GetVideoWithProgress(string id, int userId)
        {
            var videoWithProgress = await _catalogDb.UserVideoProgresses
                .Where(uvp => uvp.UserId == userId && uvp.Video.FileId == id)
                .Select(uvp => new GetVideoResult
                {
                    Id = uvp.Video.Id,
                    FileId = uvp.Video.FileId,
                    Name = uvp.Video.Name,
                    Description = uvp.Video.Description,
                    Status = uvp.Video.Status,
                    ImageFileName = uvp.Video.ImageFileName,
                    UploadedAt = uvp.Video.UploadedAt,
                    Progress = uvp.Progress
                })
                .FirstOrDefaultAsync();
            if (videoWithProgress != null)
            {
                return videoWithProgress;
            }
            var video = await _catalogDb.Videos
                .FirstOrDefaultAsync(v => v.FileId == id);
            return new GetVideoResult
            {
                Id = video.Id,
                FileId = video.FileId,
                Name = video.Name,
                Description = video.Description,
                Status = video.Status,
                ImageFileName = video.ImageFileName,
                UploadedAt = video.UploadedAt,
                Progress = null
            };
        }

        public async Task<List<Video>> GetVideos(int userId)
        {
            var videos = await _catalogDb.Videos.ToListAsync();
            return videos;
        }

        public async Task<List<Video>> GetVideosForUser(int userId)
        {
            var videos = await _catalogDb.UserVideoLists
                .Where(uvl => uvl.UserId == userId)
                .Select(uvl => uvl.Video)
                .ToListAsync();
            return videos;

        }

        public async Task<List<Video>> Search(SearchVideoParam param)
        {
            var videos = await _catalogDb.Videos.Where(v => v.Name.Contains(param.SearchText)).ToListAsync();
            return videos;
        }

        public async Task UpdateVideo(string id, UpdateVideoParam param, IFormFile file)
        {
            var video = await _catalogDb.Videos.FirstOrDefaultAsync(v => v.FileId == id);
            if (file != null)
            {
                var imgDirectoryPath = Path.Combine(_fileStorageSettings.Path, "images");
                var dir = new DirectoryInfo(imgDirectoryPath);
                if (!dir.Exists)
                {
                    dir.Create();
                }
                foreach (var oldFile in dir.EnumerateFiles(id + ".*"))
                {
                    oldFile.Delete();
                }
                var imageFileName = id + file.FileName.Substring(file.FileName.LastIndexOf("."));
                var filePath = imgDirectoryPath = Path.Combine(imgDirectoryPath, imageFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);

                }
                video.ImageFileName = imageFileName;
            }
            video.Name = param.Title;
            video.Description = param.Description;
            await _catalogDb.SaveChangesAsync();
        }

        public async Task UpdateProgress(string id, UpdateProgressParam param, int userId)
        {
            var progress = await _catalogDb.UserVideoProgresses
                .FirstOrDefaultAsync(uvp => uvp.UserId == userId && uvp.Video.FileId == id);
            if (param.Finished)
            {
                if (progress != null)
                {
                    _catalogDb.Remove(progress);
                }
            } else
            {
                if (progress == null)
                {
                    var video = await _catalogDb.Videos
                        .FirstOrDefaultAsync(v => v.FileId == id);
                    progress = new UserVideoProgress
                    {
                        Video = video,
                        UserId = userId
                    };
                    await _catalogDb.AddAsync(progress);
                }
                progress.Progress = param.Progress;
            }
            await _catalogDb.SaveChangesAsync();
        }

        public async Task UpdateList(UpdateListParam param, int userId)
        {
            if (param.VideosToRemove.Count != 0)
            {
                var videosToRemove = await _catalogDb.UserVideoLists
                    .Where(uvl => param.VideosToRemove.Contains(uvl.Video.Id))
                    .ToListAsync();
                _catalogDb.RemoveRange(videosToRemove);
            }
            if (param.VideosToAdd.Count != 0)
            {
                var videosToAdd = await _catalogDb.Videos
                    .Where(v => param.VideosToAdd.Contains(v.Id))
                    .ToListAsync();
                var userVideosToAdd = videosToAdd.Select(video => new UserVideoList
                {
                    Video = video,
                    UserId = userId
                });
                await _catalogDb.AddRangeAsync(userVideosToAdd);
            }
            if (param.VideosToRemove.Count != 0 || param.VideosToAdd.Count != 0)
            {
                await _catalogDb.SaveChangesAsync();
            }
        }

        public async Task<List<int>> CheckVideoIdsForUserList(CheckVideoIdsForUserListParam param, int userId)
        {
            var videoIds = await _catalogDb.UserVideoLists
                .Where(uvl => uvl.UserId == userId && param.VideoIds.Contains(uvl.Video.Id))
                .Select(uvl => uvl.Video.Id)
                .ToListAsync();
            return videoIds;
        }
    }
}
