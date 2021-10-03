using Microsoft.EntityFrameworkCore;
using CatalogsService.Entities;

namespace CatalogsService.Database
{
    public class CatalogDbContext : DbContext
    {
        public DbSet<Video> Videos { get; set; }

        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }
    }
}
