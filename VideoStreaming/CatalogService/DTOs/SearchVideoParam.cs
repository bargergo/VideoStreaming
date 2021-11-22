using System.ComponentModel.DataAnnotations;

namespace CatalogService.DTOs
{
    public class SearchVideoParam
    {
        [Required]
        [MinLength(2)]
        public string SearchText { get; set; }
    }
}
