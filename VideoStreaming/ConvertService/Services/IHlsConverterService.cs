using System;
using System.Threading.Tasks;

namespace ConvertService.Services
{
    public interface IHlsConverterService
    {
        Task ConvertToHls(Guid fileId);
    }
}
