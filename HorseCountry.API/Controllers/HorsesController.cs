using HorseCountry.API.Persistence;
using HorseCountry.API.Persistence.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HorseCountry.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HorsesController : ControllerBase
{
    private readonly HorseDbContext _context;

    public HorsesController(HorseDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> Get([FromQuery] int page = 1, [FromQuery] int pageSize = 8)
    {
        var query = _context.Horses.AsQueryable();

        var totalItems = await query.CountAsync();
        var horses = await query
            .Include(h => h.Breed)
            .Include(h => h.Color)
            .Include(h => h.Status)
            .Skip((page - 1) * pageSize) // Salta los de las páginas anteriores
            .Take(pageSize)              // Toma solo los de la página actual
            .ToListAsync();

        return Ok(new { 
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
            CurrentPage = page,
            Items = horses 
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Horse>> GetById(int id)
    {
        var horse = await _context.Horses
            .Include(h => h.Breed)
            .Include(h => h.Color)
            .Include(h => h.Gender)
            .Include(h => h.Status)
            .FirstOrDefaultAsync(h => h.Id == id);

        if (horse == null) return NotFound();

        return Ok(horse);
    }

    /*[HttpPut("{id}")]
    public async Task<IActionResult> UpdateHorse(int id, [FromBody] HorseDto horseDto)
    {
        var horse = await _context.Horses.FindAsync(id);
        if (horse == null) return NotFound();

        
        if (Enum.TryParse(typeof(Status), horseDto.Status, out var statusObj))
        {
            horse.Status = (Status)statusObj;
        }
        else
        {
            return BadRequest($"Estado inválido: {horseDto.Status}");
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }*/
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHorse(int id, [FromBody] HorseDto horseDto)
    {
        var horse = await _context.Horses.FindAsync(id);
        if (horse == null) return NotFound();

        // Actualizamos directamente usando el ID numérico que viene del Front
        horse.StatusId = horseDto.StatusId;
        
        if (!string.IsNullOrEmpty(horseDto.Name)) horse.Name = horseDto.Name;
        if (!string.IsNullOrEmpty(horseDto.ImageUrl)) horse.ImageUrl = horseDto.ImageUrl;
        horse.Price = (double)horseDto.Price;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<Horse>> CreateHorse([FromBody] HorseDto horseDto)
    {
        // 1. Crear la entidad a partir del DTO
        var newHorse = new Horse
        {
            Name = horseDto.Name,
            Descriprtion = horseDto.Description,
            Price = (double)horseDto.Price,
            ImageUrl = horseDto.ImageUrl,
            BreedId = horseDto.BreedId,
            ColorId = horseDto.ColorId,
            StatusId = 4,
            GenderId = horseDto.GenderId,
            UserId = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Horses.Add(newHorse);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = newHorse.Id }, newHorse);
    }


}