using System.Threading.Tasks;
using tusdotnet.Models.Configuration;

namespace UploadService.Services
{
    public interface ITusService
    {
        Task OnBeforeCreateAsync(BeforeCreateContext context);
        Task OnFileCompleteAsync(FileCompleteContext context);
        Task OnAuthorizeAsync(AuthorizeContext context);
    }
}
