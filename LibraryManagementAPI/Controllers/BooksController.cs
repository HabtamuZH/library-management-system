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
    public class BooksController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IMapper _mapper;
        
        public BooksController(LibraryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        [HttpGet]
        public ActionResult<IEnumerable<BookDto>> GetBooks()
        {
            try
            {
                var books = _context.Books
                    .Include(b => b.AuthorEntity)
                    .OrderBy(b => b.Title)
                    .ToList();
                var bookDtos = _mapper.Map<List<BookDto>>(books);
                return Ok(bookDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving books", error = ex.Message });
            }
        }
        
        [HttpGet("{id}")]
        public ActionResult<BookDto> GetBook(int id)
        {
            try
            {
                var book = _context.Books
                    .Include(b => b.AuthorEntity)
                    .FirstOrDefault(b => b.Id == id);
                
                if (book == null)
                {
                    return NotFound(new { message = "Book not found" });
                }
                
                var bookDto = _mapper.Map<BookDto>(book);
                return Ok(bookDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the book", error = ex.Message });
            }
        }
        
        [HttpPost]
        public ActionResult<BookDto> CreateBook(CreateBookDto createBookDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                // Check if ISBN already exists
                if (!string.IsNullOrEmpty(createBookDto.ISBN) && _context.Books.Any(b => b.ISBN == createBookDto.ISBN))
                {
                    return BadRequest(new { message = "A book with this ISBN already exists" });
                }
                
                var book = _mapper.Map<Book>(createBookDto);
                
                // If AuthorId is provided, validate it exists and update the Author field
                if (book.AuthorId.HasValue)
                {
                    var author = _context.Authors.Find(book.AuthorId.Value);
                    if (author == null)
                    {
                        return BadRequest(new { message = "Selected author does not exist" });
                    }
                    book.Author = author.Name;
                }
                
                _context.Books.Add(book);
                _context.SaveChanges();
                
                // Reload the book with author information
                var createdBook = _context.Books
                    .Include(b => b.AuthorEntity)
                    .FirstOrDefault(b => b.Id == book.Id);
                
                var bookDto = _mapper.Map<BookDto>(createdBook);
                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, bookDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the book", error = ex.Message });
            }
        }
        
        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, UpdateBookDto updateBookDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                var existingBook = _context.Books.Find(id);
                if (existingBook == null)
                {
                    return NotFound(new { message = "Book not found" });
                }
                
                // Check if ISBN already exists for another book
                if (!string.IsNullOrEmpty(updateBookDto.ISBN) && _context.Books.Any(b => b.ISBN == updateBookDto.ISBN && b.Id != id))
                {
                    return BadRequest(new { message = "A book with this ISBN already exists" });
                }
                
                // If AuthorId is provided, validate it exists and update the Author field
                if (updateBookDto.AuthorId.HasValue)
                {
                    var author = _context.Authors.Find(updateBookDto.AuthorId.Value);
                    if (author == null)
                    {
                        return BadRequest(new { message = "Selected author does not exist" });
                    }
                    updateBookDto.Author = author.Name;
                }
                
                _mapper.Map(updateBookDto, existingBook);
                existingBook.UpdatedAt = DateTime.UtcNow;
                
                _context.SaveChanges();
                
                // Reload the book with author information
                var updatedBook = _context.Books
                    .Include(b => b.AuthorEntity)
                    .FirstOrDefault(b => b.Id == id);
                
                var bookDto = _mapper.Map<BookDto>(updatedBook);
                return Ok(bookDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the book", error = ex.Message });
            }
        }
        
        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            try
            {
                var book = _context.Books.Find(id);
                if (book == null)
                {
                    return NotFound(new { message = "Book not found" });
                }
                
                _context.Books.Remove(book);
                _context.SaveChanges();
                
                return Ok(new { message = "Book deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the book", error = ex.Message });
            }
        }
        
          [HttpGet("search")]
        public ActionResult<IEnumerable<BookDto>> SearchBooks([FromQuery] string? title, [FromQuery] string? author, [FromQuery] string? category)
        {
            try
            {
                var query = _context.Books
                    .Include(b => b.AuthorEntity)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(title))
                {
                    query = query.Where(b => b.Title.ToLower().Contains(title.ToLower()));
                }

                if (!string.IsNullOrEmpty(author))
                {
                    query = query.Where(b => b.Author.ToLower().Contains(author.ToLower()) || 
                                           (b.AuthorEntity != null && b.AuthorEntity.Name.ToLower().Contains(author.ToLower())));
                }

                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(b => b.Category.ToLower().Contains(category.ToLower()));
                }

                var books = query.OrderBy(b => b.Title).ToList();
                var bookDtos = _mapper.Map<List<BookDto>>(books);
                return Ok(bookDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching books", error = ex.Message });
            }
        }
    }
}

