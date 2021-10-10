using CatalogService.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Database
{
    public class CatalogDbContext : DbContext
    {
        public DbSet<Video> Videos { get; set; }

        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Video>(entity =>
            {
                entity.HasIndex(e => e.FileId).IsUnique();
            });
        }
    }
}
