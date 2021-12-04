using CatalogService.Database.Entities;
using System;

namespace CatalogService.DTOs
{
    public class VideoInfo
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public Status Status { get; set; }

        public string ImageFileName { get; set; }

        public DateTime UploadedAt { get; set; }
    }
}
