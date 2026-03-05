public class HorseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string BreedDescription { get; set; } = string.Empty;
    public string ColorDescription { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public int BreedId { get; set; }
    public int ColorId { get; set; }
    public int GenderId { get; set; }
    
}