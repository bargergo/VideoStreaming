using System;
using System.Collections.Generic;

namespace CatalogService.DTOs
{
    public class UpdateListParam
    {
        public List<Guid> VideosToAdd { get; set; }
        public List<Guid> VideosToRemove { get; set; }
    }
}
