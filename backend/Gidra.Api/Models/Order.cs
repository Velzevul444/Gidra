using System.ComponentModel.DataAnnotations;

namespace Gidra.Api.Models;

public sealed class Order
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public required string CustomerName { get; set; }

    [Required]
    [MaxLength(320)]
    public required string Email { get; set; }

    [Required]
    [MaxLength(500)]
    public required string DeliveryAddress { get; set; }

    [MaxLength(100)]
    public string Status { get; set; } = "New";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
