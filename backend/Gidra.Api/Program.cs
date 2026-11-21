using Gidra.Api.Data;
using Gidra.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<GidraDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy => policy
        .WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("Frontend");
app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<GidraDbContext>();
    await db.Database.MigrateAsync();
}

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/categories", async (GidraDbContext db) =>
    Results.Ok(await db.Categories.OrderBy(x => x.Name).Select(x => new { x.Id, x.Name }).ToListAsync()));

app.MapGet("/api/products", async (GidraDbContext db, string? search, int? categoryId) =>
{
    var query = db.Products.Include(x => x.Category).AsQueryable();
    if (!string.IsNullOrWhiteSpace(search))
    {
        var normalized = search.Trim().ToLower();
        query = query.Where(x => x.Name.ToLower().Contains(normalized));
    }
    if (categoryId.HasValue)
        query = query.Where(x => x.CategoryId == categoryId.Value);

    var products = await query.OrderBy(x => x.Id).Select(x => new
    {
        x.Id,
        x.Name,
        Price = x.Price,
        Category = x.Category.Name,
        CategoryId = x.CategoryId,
        Image = x.ImageUrl,
        x.Description
    }).ToListAsync();
    return Results.Ok(products);
});

app.MapGet("/api/products/{id:int}", async (int id, GidraDbContext db) =>
{
    var product = await db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);
    return product is null ? Results.NotFound() : Results.Ok(new
    {
        product.Id,
        product.Name,
        Price = product.Price,
        Category = product.Category.Name,
        CategoryId = product.CategoryId,
        Image = product.ImageUrl,
        product.Description
    });
});

app.MapPut("/api/cart/{sessionId:guid}", async (
    Guid sessionId,
    CartUpdateRequest request,
    GidraDbContext db) =>
{
    var cart = await db.Carts.Include(x => x.Items).FirstOrDefaultAsync(x => x.SessionId == sessionId);
    if (cart is null)
    {
        cart = new Cart { Id = Guid.NewGuid(), SessionId = sessionId };
        db.Carts.Add(cart);
    }

    var productIds = request.Items.Select(x => x.ProductId).Distinct().ToList();
    var products = await db.Products.Where(x => productIds.Contains(x.Id)).ToDictionaryAsync(x => x.Id);
    if (products.Count != productIds.Count)
        return Results.BadRequest(new { error = "One or more products do not exist" });

    db.CartItems.RemoveRange(cart.Items);
    cart.Items = request.Items
        .Where(x => x.Quantity > 0)
        .Select(x => new CartItem
        {
            Cart = cart,
            ProductId = x.ProductId,
            Quantity = x.Quantity
        }).ToList();
    cart.UpdatedAt = DateTimeOffset.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(await GetCartAsync(db, sessionId));
});

app.MapGet("/api/cart/{sessionId:guid}", async (Guid sessionId, GidraDbContext db) =>
    Results.Ok(await GetCartAsync(db, sessionId)));

app.MapDelete("/api/cart/{sessionId:guid}", async (Guid sessionId, GidraDbContext db) =>
{
    var cart = await db.Carts.Include(x => x.Items).FirstOrDefaultAsync(x => x.SessionId == sessionId);
    if (cart is null) return Results.NoContent();
    db.CartItems.RemoveRange(cart.Items);
    db.Carts.Remove(cart);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapPost("/api/orders", async (CreateOrderRequest request, GidraDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.CustomerName) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.DeliveryAddress))
        return Results.BadRequest(new { error = "Customer name, email and address are required" });

    var cart = await db.Carts.Include(x => x.Items).ThenInclude(x => x.Product)
        .FirstOrDefaultAsync(x => x.SessionId == request.SessionId);
    if (cart is null || cart.Items.Count == 0)
        return Results.BadRequest(new { error = "Cart is empty" });

    var order = new Order
    {
        Id = Guid.NewGuid(),
        CustomerName = request.CustomerName.Trim(),
        Email = request.Email.Trim(),
        DeliveryAddress = request.DeliveryAddress.Trim()
    };

    foreach (var item in cart.Items)
    {
        order.Items.Add(new OrderItem
        {
            ProductId = item.ProductId,
            Quantity = item.Quantity,
            UnitPrice = item.Product.Price
        });
    }

    db.Orders.Add(order);
    db.CartItems.RemoveRange(cart.Items);
    db.Carts.Remove(cart);
    await db.SaveChangesAsync();

    return Results.Created($"/api/orders/{order.Id}", new
    {
        order.Id,
        order.Status,
        order.CreatedAt,
        Total = order.Items.Sum(x => x.UnitPrice * x.Quantity)
    });
});

app.MapGet("/api/orders/{id:guid}", async (Guid id, GidraDbContext db) =>
{
    var order = await db.Orders.Include(x => x.Items).ThenInclude(x => x.Product)
        .FirstOrDefaultAsync(x => x.Id == id);
    if (order is null) return Results.NotFound();
    return Results.Ok(new
    {
        order.Id,
        order.CustomerName,
        order.Email,
        order.DeliveryAddress,
        order.Status,
        order.CreatedAt,
        Total = order.Items.Sum(x => x.UnitPrice * x.Quantity),
        Items = order.Items.Select(x => new
        {
            x.ProductId,
            ProductName = x.Product.Name,
            x.Quantity,
            x.UnitPrice
        })
    });
});

app.Run();

static async Task<object> GetCartAsync(GidraDbContext db, Guid sessionId)
{
    var cart = await db.Carts.Include(x => x.Items).ThenInclude(x => x.Product)
        .FirstOrDefaultAsync(x => x.SessionId == sessionId);
    if (cart is null)
        return new { SessionId = sessionId, Items = Array.Empty<object>(), Total = 0m };

    var items = cart.Items.Select(x => new
    {
        x.ProductId,
        ProductName = x.Product.Name,
        Price = x.Product.Price,
        Image = x.Product.ImageUrl,
        x.Quantity
    }).ToList();
    return new { cart.SessionId, Items = items, Total = items.Sum(x => x.Price * x.Quantity) };
}

record CartUpdateRequest(IReadOnlyCollection<CartUpdateItem> Items);
record CartUpdateItem(int ProductId, int Quantity);
record CreateOrderRequest(Guid SessionId, string CustomerName, string Email, string DeliveryAddress);
