using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatalogService.Database.Entities
{
    public class Video
    {
        public int Id { get; set; }
        [Required]
        public string FileId { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        [Column(TypeName = "nvarchar(24)")]
        public Status Status { get; set; }

        public string ImageFileName { get; set; }
        [Required]
        public DateTime UploadedAt { get; set; }
    }
}
