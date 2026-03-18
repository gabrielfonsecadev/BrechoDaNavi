using BrechoApi.Data;
using BrechoApi.Models;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;

namespace BrechoApi.Endpoints;

public static class AdminProductEndpoints
{
    public static void MapAdminProductEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/admin/products").WithTags("Admin - Produtos");

        // POST /admin/products
        group.MapPost("/", async (ProductInputModel input, AppDbContext db) =>
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = input.Name,
                Description = input.Description,
                Price = input.Price,
                CreatedAt = DateTime.UtcNow,
                Images = new List<ProductImage>()
            };

            db.Products.Add(product);
            await db.SaveChangesAsync();

            return Results.Created($"/products/{product.Id}", product);
        })
        .WithName("CreateProduct")
        .WithSummary("Cria um novo produto");

        // PUT /admin/products/{id}
        group.MapPut("/{id:guid}", async (Guid id, ProductInputModel input, AppDbContext db) =>
        {
            var product = await db.Products.FindAsync(id);
            if (product is null)
                return Results.NotFound(new { error = "Produto não encontrado." });

            product.Name = input.Name;
            product.Description = input.Description;
            product.Price = input.Price;
            
            await db.SaveChangesAsync();

            return Results.Ok(product);
        })
        .WithName("UpdateProduct")
        .WithSummary("Atualiza um produto existente");

        // POST /admin/products/{id}/images
        group.MapPost("/{id:guid}/images", async (Guid id, IFormFile file, AppDbContext db) =>
        {
            var product = await db.Products.FindAsync(id);
            if (product is null)
                return Results.NotFound(new { error = "Produto não encontrado." });

            if (file is null || file.Length == 0)
                return Results.BadRequest(new { error = "Nenhum arquivo enviado." });

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            try
            {
                using var image = await Image.LoadAsync(memoryStream);
                
                const int maxSize = 1024;
                if (image.Width > maxSize || image.Height > maxSize)
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new Size(maxSize, maxSize),
                        Mode = ResizeMode.Max
                    }));
                }

                using var outStream = new MemoryStream();
                await image.SaveAsWebpAsync(outStream, new WebpEncoder { Quality = 80 });

                var productImage = new ProductImage
                {
                    Id = Guid.NewGuid(),
                    ProductId = id,
                    ImageData = outStream.ToArray(),
                    ContentType = "image/webp",
                    CreatedAt = DateTime.UtcNow
                };

                db.ProductImages.Add(productImage);
                await db.SaveChangesAsync();

                return Results.Ok(new { id = productImage.Id, message = "Imagem carregada com sucesso." });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = "Arquivo de imagem inválido.", details = ex.Message });
            }
        })
        .WithName("UploadProductImage")
        .WithSummary("Faz o upload de uma imagem, converte para WebP e salva no banco")
        .DisableAntiforgery();

        // DELETE /admin/products/{id}/images/{imageId}
        group.MapDelete("/{id:guid}/images/{imageId:guid}", async (Guid id, Guid imageId, AppDbContext db) =>
        {
            var image = await db.ProductImages.FirstOrDefaultAsync(i => i.Id == imageId && i.ProductId == id);
            if (image is null)
                return Results.NotFound(new { error = "Imagem não encontrada." });

            db.ProductImages.Remove(image);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteProductImage")
        .WithSummary("Remove uma imagem específica de um produto");

        // DELETE /admin/products/{id}
        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var product = await db.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            if (product is null)
                return Results.NotFound(new { error = "Produto não encontrado." });

            db.Products.Remove(product);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteProduct")
        .WithSummary("Remove um produto");
    }
}
