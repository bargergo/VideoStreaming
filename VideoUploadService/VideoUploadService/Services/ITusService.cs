using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using tusdotnet.Models.Configuration;

namespace VideoUploadService.Services
{
    public interface ITusService
    {
        Task OnBeforeCreateAsync(BeforeCreateContext context);
        Task OnFileCompleteAsync(FileCompleteContext context);
    }
}
