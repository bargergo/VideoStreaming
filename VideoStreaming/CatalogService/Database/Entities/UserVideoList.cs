using System.ComponentModel.DataAnnotations;

namespace CatalogService.Database.Entities
{
    public class UserVideoList
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int VideoId { get; set; }
        [Required]
        public Video Video { get; set; }
    }
}
