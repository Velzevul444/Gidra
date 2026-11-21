namespace Gidra.Api.Models;

public sealed class Cart
{
    public Guid Id { get; set; }
    public Guid SessionId { get; set; }
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
