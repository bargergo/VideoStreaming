using CatalogService.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Database
{
    public class CatalogDbContext : DbContext
    {
        public DbSet<Video> Videos { get; set; }
        public DbSet<UserVideoList> UserVideoLists { get; set; }
        public DbSet<UserVideoProgress> UserVideoProgresses { get; set; }

        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Video>(entity =>
            {
                entity.HasIndex(e => e.FileId).IsUnique();
            });

            modelBuilder.Entity<UserVideoList>(entity =>
            {
                entity.HasOne(uvl => uvl.Video);
                entity.HasIndex(uvl => uvl.UserId);
            });

            modelBuilder.Entity<UserVideoProgress>(entity =>
            {
                entity.HasOne(uvp => uvp.Video);
                entity.HasIndex(uvp => uvp.UserId);
            });
        }
    }
}
