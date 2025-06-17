using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "Admin";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

