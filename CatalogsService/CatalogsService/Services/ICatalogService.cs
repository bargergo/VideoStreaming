using CatalogsService.DTOs;
using CatalogsService.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CatalogsService.Services
{
    public interface ICatalogService
    {
        Task<List<Video>> GetVideos();
        Task<Video> CreateVideo(CreateVideoParam param);
    }
}
