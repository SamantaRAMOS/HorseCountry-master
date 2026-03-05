namespace HorseCountry.API.Persistence.Entities;

public class Horse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BreedId { get; set; }
    public int ColorId { get; set; }
    public int GenderId { get; set; }
    public int StatusId { get; set; }
    public required string Name { get; set; }
    public required string Descriprtion { get; set; }
    public string? ImageUrl { get; set; }
    public int Age { get; set; }
    public Double Price { get; set; }
    public DateTime CreatedAt {  get; set; }
    public DateTime UpdatedAt { get; set; }

    public virtual Breed? Breed { get; set; }
    public virtual Color? Color { get; set; }
    public virtual Gender? Gender { get; set; }
    public virtual Status? Status {get;set;}
}
