using System.ComponentModel.DataAnnotations;

namespace CatalogService.Database.Entities
{
    public class UserVideoProgress
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int VideoId { get; set; }
        public Video Video { get; set; }
        public float Progress { get; set; }
    }
}
