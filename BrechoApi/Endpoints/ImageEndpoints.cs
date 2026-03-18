using BrechoApi.Data;

namespace BrechoApi.Endpoints;

public static class ImageEndpoints
{
    public static void MapImageEndpoints(this WebApplication app)
    {
        // GET /products/images/{imageId}
        app.MapGet("/products/images/{imageId:guid}", async (Guid imageId, AppDbContext db) =>
        {
            var image = await db.ProductImages.FindAsync(imageId);
            if (image is null)
                return Results.NotFound();

            return Results.File(image.ImageData, image.ContentType);
        })
        .WithName("GetProductImage")
        .WithSummary("Retorna a imagem do produto em formato WebP")
        .WithTags("Produtos");
    }
}
