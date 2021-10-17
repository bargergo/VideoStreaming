using CatalogService.Database.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatalogService.DTOs
{
    public class VideoInfo
    {
        public int Id { get; set; }
        public string FileId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public Status Status { get; set; }

        public string ImageFileName { get; set; }

        public DateTime UploadedAt { get; set; }
        public bool AddedToList { get; set; }
    }
}
