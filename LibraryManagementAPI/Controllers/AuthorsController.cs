using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LibraryManagementAPI.Data;
using LibraryManagementAPI.Models;
using LibraryManagementAPI.DTOs;
using AutoMapper;

namespace LibraryManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AuthorsController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IMapper _mapper;
        
        public AuthorsController(LibraryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        [HttpGet]
        [AllowAnonymous]
        public ActionResult<IEnumerable<AuthorDto>> GetAuthors()
        {
            try
            {
                var authors = _context.Authors
                    .Include(a => a.Books)
                    .OrderBy(a => a.Name)
                    .ToList();
                
                var authorDtos = authors.Select(a => new AuthorDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Biography = a.Biography,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt,
                    BookCount = a.Books.Count
                }).ToList();
                
                return Ok(authorDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving authors", error = ex.Message });
            }
        }
        
        [HttpGet("dropdown")]
        [AllowAnonymous]
        public ActionResult<IEnumerable<object>> GetAuthorsForDropdown()
        {
            try
            {
                var authors = _context.Authors
                    .OrderBy(a => a.Name)
                    .Select(a => new { Id = a.Id, Name = a.Name })
                    .ToList();
                
                return Ok(authors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving authors for dropdown", error = ex.Message });
            }
        }
        
        [HttpGet("{id}")]
        public ActionResult<AuthorWithBooksDto> GetAuthor(int id)
        {
            try
            {
                var author = _context.Authors
                    .Include(a => a.Books)
                    .FirstOrDefault(a => a.Id == id);
                
                if (author == null)
                {
                    return NotFound(new { message = "Author not found" });
                }
                
                var authorDto = new AuthorWithBooksDto
                {
                    Id = author.Id,
                    Name = author.Name,
                    Biography = author.Biography,
                    CreatedAt = author.CreatedAt,
                    UpdatedAt = author.UpdatedAt,
                    Books = _mapper.Map<List<BookDto>>(author.Books)
                };
                
                return Ok(authorDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the author", error = ex.Message });
            }
        }
        
        [HttpPost]
        public ActionResult<AuthorDto> CreateAuthor(CreateAuthorDto createAuthorDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                // Check if author name already exists
                if (_context.Authors.Any(a => a.Name.ToLower() == createAuthorDto.Name.ToLower()))
                {
                    return BadRequest(new { message = "Author with this name already exists" });
                }
                
                var author = _mapper.Map<Author>(createAuthorDto);
                author.CreatedAt = DateTime.UtcNow;
                author.UpdatedAt = DateTime.UtcNow;
                
                _context.Authors.Add(author);
                _context.SaveChanges();
                
                var authorDto = new AuthorDto
                {
                    Id = author.Id,
                    Name = author.Name,
                    Biography = author.Biography,
                    CreatedAt = author.CreatedAt,
                    UpdatedAt = author.UpdatedAt,
                    BookCount = 0
                };
                
                return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, authorDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the author", error = ex.Message });
            }
        }
        
        [HttpPut("{id}")]
        public IActionResult UpdateAuthor(int id, UpdateAuthorDto updateAuthorDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                var existingAuthor = _context.Authors.Find(id);
                if (existingAuthor == null)
                {
                    return NotFound(new { message = "Author not found" });
                }
                
                // Check if author name already exists for another author
                if (_context.Authors.Any(a => a.Name.ToLower() == updateAuthorDto.Name.ToLower() && a.Id != id))
                {
                    return BadRequest(new { message = "Author with this name already exists" });
                }
                
                _mapper.Map(updateAuthorDto, existingAuthor);
                existingAuthor.UpdatedAt = DateTime.UtcNow;
                
                _context.SaveChanges();
                
                var authorDto = new AuthorDto
                {
                    Id = existingAuthor.Id,
                    Name = existingAuthor.Name,
                    Biography = existingAuthor.Biography,
                    CreatedAt = existingAuthor.CreatedAt,
                    UpdatedAt = existingAuthor.UpdatedAt,
                    BookCount = _context.Books.Count(b => b.AuthorId == existingAuthor.Id)
                };
                
                return Ok(authorDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the author", error = ex.Message });
            }
        }
        
        [HttpDelete("{id}")]
        public IActionResult DeleteAuthor(int id)
        {
            try
            {
                var author = _context.Authors
                    .Include(a => a.Books)
                    .FirstOrDefault(a => a.Id == id);
                
                if (author == null)
                {
                    return NotFound(new { message = "Author not found" });
                }
                
                // Check if author has books
                if (author.Books.Any())
                {
                    return BadRequest(new { message = $"Cannot delete author. Author has {author.Books.Count} book(s) associated. Please reassign or delete the books first." });
                }
                
                _context.Authors.Remove(author);
                _context.SaveChanges();
                
                return Ok(new { message = "Author deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the author", error = ex.Message });
            }
        }
    }
}

