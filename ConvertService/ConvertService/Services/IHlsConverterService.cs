using System.Threading.Tasks;

namespace ConvertService.Services
{
    public interface IHlsConverterService
    {
        Task ConvertToHls(string fileId);
    }
}
