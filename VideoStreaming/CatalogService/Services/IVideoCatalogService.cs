using CatalogService.Database.Entities;
using CatalogService.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CatalogService.Services
{
    public interface IVideoCatalogService
    {
        Task<List<Video>> GetVideos();
        Task<Video> CreateVideo(Video param);
        Task<Video> GetVideo(string id);
        Task DeleteVideo(string id);
        Task UpdateVideo(string id, UpdateVideoParam param);
        Task<List<Video>> Search(SearchVideoParam param);
    }
}
