using Gidra.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Gidra.Api.Data;

public sealed class GidraDbContext(DbContextOptions<GidraDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasIndex(x => x.Name).IsUnique();
        modelBuilder.Entity<Cart>().HasIndex(x => x.SessionId).IsUnique();
        modelBuilder.Entity<CartItem>().HasIndex(x => new { x.CartId, x.ProductId }).IsUnique();

        modelBuilder.Entity<CartItem>()
            .HasOne(x => x.Cart).WithMany(x => x.Items)
            .HasForeignKey(x => x.CartId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(x => x.Product).WithMany(x => x.CartItems)
            .HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderItem>()
            .HasOne(x => x.Order).WithMany(x => x.Items)
            .HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(x => x.Product).WithMany(x => x.OrderItems)
            .HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Для дома" },
            new Category { Id = 2, Name = "Ноутбуки" },
            new Category { Id = 3, Name = "Смартфоны" },
            new Category { Id = 4, Name = "Наушники" },
            new Category { Id = 5, Name = "Фото и видео" },
            new Category { Id = 6, Name = "Аудио" },
            new Category { Id = 7, Name = "Компьютеры" }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Кофеварка Philips 1234", Price = 2999, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 2, Name = "Ноутбук Lenovo ThinkPad X1", Price = 12999, CategoryId = 2, ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 3, Name = "Смартфон Samsung Galaxy S24", Price = 7499, CategoryId = 3, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 4, Name = "Пылесос Dyson V11", Price = 11999, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 5, Name = "Термос Tupperware", Price = 1999, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 6, Name = "Наушники Sony WH-1000XM4", Price = 15999, CategoryId = 4, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 7, Name = "Часы Apple Watch Series 9", Price = 22999, CategoryId = 3, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 8, Name = "Камера Canon EOS R5", Price = 54999, CategoryId = 5, ImageUrl = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 9, Name = "Планшет для творчества", Price = 18990, CategoryId = 3, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 10, Name = "Портативная колонка Sound Go", Price = 4990, CategoryId = 6, ImageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 11, Name = "Монитор UltraView 27", Price = 24990, CategoryId = 7, ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" },
            new Product { Id = 12, Name = "Беспроводная мышь Air", Price = 2490, CategoryId = 7, ImageUrl = "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80" }
        );
    }
}
