namespace CatalogService.Database.Entities
{
    public class UserVideoList
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Video Video { get; set; }
    }
}
