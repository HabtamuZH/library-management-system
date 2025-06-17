using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.DTOs
{
    public class AuthorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Biography { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int BookCount { get; set; }
    }

    public class CreateAuthorDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Biography cannot exceed 1000 characters")]
        public string? Biography { get; set; }
    }

    public class UpdateAuthorDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Biography cannot exceed 1000 characters")]
        public string? Biography { get; set; }
    }

    public class AuthorWithBooksDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Biography { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<BookDto> Books { get; set; } = new List<BookDto>();
    }
}

