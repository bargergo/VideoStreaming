using System.ComponentModel.DataAnnotations;

namespace CatalogService.DTOs
{
    public class UpdateVideoParam
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
    }
}
