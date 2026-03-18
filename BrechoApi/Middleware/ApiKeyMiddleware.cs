namespace BrechoApi.Middleware;

public class ApiKeyMiddleware(RequestDelegate next, IConfiguration config)
{
    private const string ApiKeyHeader = "x-api-key";

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/admin"))
        {
            if (!context.Request.Headers.TryGetValue(ApiKeyHeader, out var extractedKey))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { error = "API Key ausente." });
                return;
            }

            var apiKey = config["ApiKey"];
            if (!string.Equals(extractedKey, apiKey, StringComparison.Ordinal))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { error = "API Key inválida." });
                return;
            }
        }

        await next(context);
    }
}
