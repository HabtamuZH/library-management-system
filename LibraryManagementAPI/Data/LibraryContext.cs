using Microsoft.EntityFrameworkCore;
using LibraryManagementAPI.Models;

namespace LibraryManagementAPI.Data
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Author> Authors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Author-Book relationship
            modelBuilder.Entity<Book>()
                .HasOne(b => b.AuthorEntity)
                .WithMany(a => a.Books)
                .HasForeignKey(b => b.AuthorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Seed data
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                }
            );

            modelBuilder.Entity<Author>().HasData(
                new Author { Id = 1, Name = "George Orwell", Biography = "English novelist and essayist, journalist and critic.", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Author { Id = 2, Name = "F. Scott Fitzgerald", Biography = "American novelist, essayist, short story writer and screenwriter.", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Author { Id = 3, Name = "Harper Lee", Biography = "American novelist widely known for To Kill a Mockingbird.", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );

            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    Id = 1,
                    Title = "1984",
                    Author = "George Orwell",
                    ISBN = "9780451524935",
                    PublishedDate = new DateTime(1949, 6, 8),
                    Quantity = 4,
                    Description = "A dystopian social science fiction novel and cautionary tale.",
                    Category = "Science Fiction",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    AuthorId = 1
                },
                new Book
                {
                    Id = 2,
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    ISBN = "9780743273565",
                    PublishedDate = new DateTime(1925, 4, 10),
                    Quantity = 5,
                    Description = "A classic American novel set in the Jazz Age.",
                    Category = "Fiction",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    AuthorId = 2
                },
                new Book
                {
                    Id = 3,
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    ISBN = "9780061120084",
                    PublishedDate = new DateTime(1960, 7, 11),
                    Quantity = 3,
                    Description = "A novel about racial injustice and childhood in the American South.",
                    Category = "Fiction",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    AuthorId = 3
                }
            );
        }
    }
}

