using BrechoApi.Data;
using Microsoft.EntityFrameworkCore;

namespace BrechoApi.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/products").WithTags("Produtos");

        // GET /products
        group.MapGet("/", async (AppDbContext db, HttpContext ctx) =>
        {
            var baseUrl = $"{ctx.Request.Scheme}://{ctx.Request.Host}/products/images/";
            var products = await db.Products
                .Include(p => p.Images)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.CreatedAt,
                    Images = p.Images.OrderBy(i => i.CreatedAt).Select(i => baseUrl + i.Id).ToList()
                })
                .ToListAsync();

            return Results.Ok(products);
        })
        .WithName("GetAllProducts")
        .WithSummary("Lista todos os produtos disponíveis (não vendidos)");

        // GET /products/{id}
        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db, HttpContext ctx) =>
        {
            var baseUrl = $"{ctx.Request.Scheme}://{ctx.Request.Host}/products/images/";
            var product = await db.Products
                .Include(p => p.Images)
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.CreatedAt,
                    Images = p.Images.OrderBy(i => i.CreatedAt).Select(i => baseUrl + i.Id).ToList()
                })
                .FirstOrDefaultAsync();

            return product is not null ? Results.Ok(product) : Results.NotFound(new { error = "Produto não encontrado." });
        })
        .WithName("GetProductById")
        .WithSummary("Busca um produto por ID");
    }
}
