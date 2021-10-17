using Microsoft.AspNetCore.Mvc;

namespace CatalogService.DTOs
{
    public class HeaderParams
    {
        [FromHeader]
        public int UserId { get; set; }
    }
}
