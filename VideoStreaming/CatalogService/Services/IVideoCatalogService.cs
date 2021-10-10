using CatalogService.Database.Entities;
using CatalogService.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CatalogService.Services
{
    public interface IVideoCatalogService
    {
        Task<List<Video>> GetVideos();
        Task<Video> CreateVideo(CreateVideoParam param);
    }
}
