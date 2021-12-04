using CatalogService.Database.Entities;
using System;

namespace CatalogService.DTOs
{
    public class GetVideoResult
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public Status Status { get; set; }

        public string ImageFileName { get; set; }

        public DateTime UploadedAt { get; set; }
        public float? Progress { get; set; }

        public bool AddedToList { get; set; }
    }
}
