using CatalogService.Database.Entities;
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
    }
}
