# Library Management System with Author Management

A complete library management system built with Angular frontend and ASP.NET Core backend, featuring comprehensive author management and one-to-many relationships.

## Features

### Admin Authentication
- Secure JWT-based authentication
- Admin-only access to all functionalities
- Default credentials: admin / admin123

### Book Management
- Add, edit, delete, and view books
- Search functionality by title, author, and category
- Book details include: title, author, ISBN, category, quantity, published date, description
- Real-time inventory tracking
- **Author relationship**: Books can be linked to authors via one-to-many relationship

### Author Management ⭐ NEW
- Add, edit, delete, and view authors
- Author details include: name, biography, creation/update dates
- **One-to-many relationship**: One author can have multiple books
- View author's books list when editing
- Prevent deletion of authors with associated books
- Author search and filtering capabilities

### User Management
- View and manage user accounts
- Role-based access control
- User creation and modification

### Dashboard
- Overview statistics (total books, available books, categories, users)
- Recent books display
- Quick action buttons for all management areas
- **Author management integration**

## Technology Stack

### Backend (ASP.NET Core)
- ASP.NET Core 8.0 Web API
- Entity Framework Core (In-Memory Database)
- JWT Authentication
- **AutoMapper for DTOs** (Data Transfer Objects)
- BCrypt for password hashing
- CORS enabled for frontend communication
- **One-to-many relationship** between Authors and Books

### Frontend (Angular)
- Angular 18
- Bootstrap 5 for styling
- Reactive forms
- HTTP client for API communication
- Route guards for authentication
- Responsive design
- **Author management components**

## Project Structure

```
library-management-system/
├── LibraryManagementAPI/          # ASP.NET Core Backend
│   ├── Controllers/               # API Controllers
│   │   ├── AuthController.cs      # Authentication
│   │   ├── BooksController.cs     # Book management
│   │   ├── UsersController.cs     # User management
│   │   └── AuthorsController.cs   # ⭐ Author management
│   ├── Models/                    # Entity Models
│   │   ├── Book.cs               # Book entity with Author FK
│   │   ├── User.cs               # User entity
│   │   └── Author.cs             # ⭐ Author entity
│   ├── DTOs/                      # Data Transfer Objects
│   │   ├── BookDtos.cs           # Book DTOs with Author fields
│   │   ├── UserDtos.cs           # User DTOs
│   │   └── AuthorDtos.cs         # ⭐ Author DTOs
│   ├── Data/                      # Database Context
│   │   └── LibraryContext.cs     # EF Context with relationships
│   ├── Mappings/                  # AutoMapper Profiles
│   │   └── MappingProfile.cs     # Entity-DTO mappings
│   └── Program.cs                 # Application Entry Point
└── LibraryManagementUI/           # Angular Frontend
    ├── src/app/
    │   ├── components/            # Angular Components
    │   │   ├── login.component.ts
    │   │   ├── dashboard.component.ts
    │   │   ├── books.component.ts
    │   │   ├── book-form.component.ts
    │   │   ├── authors.component.ts      # ⭐ Author list
    │   │   └── author-form.component.ts  # ⭐ Author add/edit
    │   ├── services/              # HTTP Services
    │   │   ├── auth.service.ts
    │   │   ├── book.service.ts
    │   │   ├── user.service.ts
    │   │   └── author.service.ts         # ⭐ Author service
    │   ├── models/                # TypeScript Interfaces
    │   │   ├── book.model.ts      # Book with Author fields
    │   │   ├── user.model.ts
    │   │   └── author.model.ts           # ⭐ Author interfaces
    │   ├── guards/                # Route Guards
    │   │   └── auth.guard.ts
    │   └── app.routes.ts          # Application Routes
    └── src/styles.css             # Global Styles
```

## Setup Instructions

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm
- Angular CLI

### Backend Setup
1. Navigate to the LibraryManagementAPI folder
2. Restore packages: `dotnet restore`
3. Run the application: `dotnet run`
4. Backend will be available at: http://localhost:5000

### Frontend Setup
1. Navigate to the LibraryManagementUI folder
2. Install dependencies: `npm install`
3. Start the development server: `ng serve`
4. Frontend will be available at: http://localhost:4200

### Default Data
The system comes pre-loaded with:
- Admin user: username "admin", password "admin123"
- Sample authors: George Orwell, F. Scott Fitzgerald, Harper Lee
- Sample books: 1984, The Great Gatsby, To Kill a Mockingbird (linked to respective authors)

## API Endpoints

### Authentication
- POST /api/auth/login - User login

### Books
- GET /api/books - Get all books (with author information)
- GET /api/books/{id} - Get book by ID
- POST /api/books - Create new book
- PUT /api/books/{id} - Update book
- DELETE /api/books/{id} - Delete book
- GET /api/books/search - Search books

### Authors ⭐ NEW
- GET /api/authors - Get all authors (with book count)
- GET /api/authors/{id} - Get author by ID (with books list)
- POST /api/authors - Create new author
- PUT /api/authors/{id} - Update author
- DELETE /api/authors/{id} - Delete author (protected if has books)

### Users
- GET /api/users - Get all users
- GET /api/users/{id} - Get user by ID
- POST /api/users - Create new user
- PUT /api/users/{id} - Update user
- DELETE /api/users/{id} - Delete user

## Database Relationships

### One-to-Many: Author → Books
- Each Author can have multiple Books
- Each Book can belong to one Author (optional)
- Foreign key: `Book.AuthorId` → `Author.Id`
- Cascade behavior: SetNull (when author is deleted, books remain but AuthorId becomes null)

## Security Features
- JWT token-based authentication
- Password hashing with BCrypt
- Role-based authorization
- CORS configuration
- Input validation and sanitization
- **DTOs for data transfer security**

## Author Management Features ⭐

### Author List Page
- Display all authors with their information
- Show book count for each author
- Edit and delete buttons (delete disabled if author has books)
- View author details in modal
- Responsive table design

### Author Form Page
- Create new authors with name and biography
- Edit existing authors
- Form validation (name required, biography optional)
- Character count for biography (max 1000)
- Show author's books when editing
- Error handling and loading states

### Integration with Books
- Books can be assigned to authors
- Author dropdown in book forms
- Display author name in book listings
- Search books by author name

## Development Notes
- The backend uses an in-memory database for simplicity
- All API endpoints require authentication except login
- The frontend includes comprehensive error handling
- Responsive design works on desktop and mobile devices
- **DTOs ensure clean separation between API and database models**
- **One-to-many relationships properly configured with Entity Framework**

## Future Enhancements
- Book borrowing/lending system
- Due date tracking
- Email notifications
- Advanced reporting
- Book reservation system
- Barcode scanning integration
- **Author photo uploads**
- **Author social media links**
- **Book series management**

