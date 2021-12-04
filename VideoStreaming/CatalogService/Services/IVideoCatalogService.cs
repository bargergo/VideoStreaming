using CatalogService.Database.Entities;
using CatalogService.DTOs;
using CatalogService.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CatalogService.Services
{
    public interface IVideoCatalogService
    {
        Task<List<Video>> GetVideos();
        Task<Video> CreateVideo(Video param);
        Task<Video> GetVideo(Guid id);
        Task<GetVideoResult> GetVideoWithProgress(Guid id, int userId);
        Task DeleteVideo(Guid id);
        Task UpdateVideo(Guid id, UpdateVideoParam param, IFormFile file);
        Task<List<Video>> Search(SearchVideoParam param);
        Task<ImageHolder> GetImage(Guid id);
        Task<List<Video>> GetVideosForUser(int userId);
        Task UpdateProgress(Guid id, UpdateProgressParam param, int userId);
        Task UpdateList(UpdateListParam param, int userId);
        Task<List<Guid>> CheckVideoIdsForUserList(CheckVideoIdsForUserListParam param, int userId);

        Task UpdateVideoStatus(Guid id, Status newStatus);
    }
}
