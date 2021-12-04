using System;
using System.ComponentModel.DataAnnotations;

namespace CatalogService.Database.Entities
{
    public class UserVideoProgress
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public Guid VideoId { get; set; }
        public Video Video { get; set; }
        public float Progress { get; set; }
    }
}
