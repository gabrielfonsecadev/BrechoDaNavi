namespace BrechoApi.Models;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<ProductImage> Images { get; set; } = [];
}

public record ProductInputModel(string Name, string Description, decimal Price);
