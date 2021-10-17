namespace CatalogService.Database.Entities
{
    public class UserVideoProgress
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Video Video { get; set; }
        public float Progress { get; set; }
    }
}
