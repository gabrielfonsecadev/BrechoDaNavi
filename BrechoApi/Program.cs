using BrechoApi.Data;
using BrechoApi.Endpoints;
using BrechoApi.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Carregar .env se existir
var dotEnv = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(dotEnv))
{
    foreach (var line in File.ReadAllLines(dotEnv))
    {
        var parts = line.Split('=', 2, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 2) Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim().Trim('"'));
    }
}

// EF Core + PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS — permite requisições do Angular em desenvolvimento
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Brechó da Navi API", Version = "v1" });
    c.AddSecurityDefinition("ApiKey", new()
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Name = "x-api-key",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Description = "Informe a API Key para acessar rotas administrativas"
    });
    c.AddSecurityRequirement(new()
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new() { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "ApiKey" }
            },
            []
        }
    });
});

var app = builder.Build();

// Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Brechó da Navi API v1");
    c.RoutePrefix = "swagger";
});

// Middlewares
app.UseCors();
app.UseMiddleware<ApiKeyMiddleware>();

// Auto-migrar banco na inicialização
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Endpoints
app.MapProductEndpoints();
app.MapAdminProductEndpoints();
app.MapImageEndpoints();

app.Run();
