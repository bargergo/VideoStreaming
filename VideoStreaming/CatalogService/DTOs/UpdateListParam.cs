using System.Collections.Generic;

namespace CatalogService.DTOs
{
    public class UpdateListParam
    {
        public List<int> VideosToAdd { get; set; }
        public List<int> VideosToRemove { get; set; }
    }
}
