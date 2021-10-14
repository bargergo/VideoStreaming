using System.ComponentModel.DataAnnotations.Schema;

namespace CatalogService.Database.Entities
{
    public class Video
    {
        public int Id { get; set; }
        public string FileId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [Column(TypeName = "nvarchar(24)")]
        public Status Status { get; set; }

        public string ImageFileName { get; set; }
    }
}
