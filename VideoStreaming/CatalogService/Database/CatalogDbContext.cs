using CatalogService.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Database
{
    public class CatalogDbContext : DbContext
    {
        public DbSet<Video> Videos { get; set; }

        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }
    }
}
