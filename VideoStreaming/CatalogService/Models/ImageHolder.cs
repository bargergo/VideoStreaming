using System.IO;

namespace CatalogService.Models
{
    public class ImageHolder
    {

        public FileStream Data { get; set; }
        public string Filename { get; set; }
        public string ContentType { get; set; }
    }
}
