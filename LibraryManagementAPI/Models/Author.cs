using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Author
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Biography { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property for one-to-many relationship
        public virtual ICollection<Book> Books { get; set; } = new List<Book>();
    }
}

