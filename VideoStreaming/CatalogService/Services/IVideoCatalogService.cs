using CatalogService.Database.Entities;
using CatalogService.DTOs;
using CatalogService.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CatalogService.Services
{
    public interface IVideoCatalogService
    {
        Task<List<Video>> GetVideos(int userId);
        Task<Video> CreateVideo(Video param);
        Task<Video> GetVideo(string id);
        Task<GetVideoResult> GetVideoWithProgress(string id, int userId);
        Task DeleteVideo(string id);
        Task UpdateVideo(string id, UpdateVideoParam param, IFormFile file);
        Task<List<Video>> Search(SearchVideoParam param);
        Task<ImageHolder> GetImage(string id);
        Task<List<Video>> GetVideosForUser(int userId);
        Task UpdateProgress(string id, UpdateProgressParam param, int userId);
        Task UpdateList(UpdateListParam param, int userId);
        Task<List<int>> CheckVideoIdsForUserList(CheckVideoIdsForUserListParam param, int userId);

        Task UpdateVideoStatus(string id, Status newStatus);
    }
}
