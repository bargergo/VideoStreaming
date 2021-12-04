using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CatalogService.DTOs
{
    public class CheckVideoIdsForUserListParam
    {
        [Required]
        public List<Guid> VideoIds { get; set; }
    }
}
