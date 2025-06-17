import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';
import { Book } from '../models/book.model';
import { NavbarComponent } from './navbar.component';


@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="container mt-4">
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center">
            <h2>Books Management</h2>
            <button class="btn btn-primary" (click)="navigateTo('/books/add')">
              Add New Book
            </button>
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="row mt-3">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search by title"
                    [(ngModel)]="searchTitle"
                    (input)="onSearch()"
                  />
                </div>
                <div class="col-md-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search by author"
                    [(ngModel)]="searchAuthor"
                    (input)="onSearch()"
                  />
                </div>
                <div class="col-md-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search by category"
                    [(ngModel)]="searchCategory"
                    (input)="onSearch()"
                  />
                </div>
                <div class="col-md-3">
                  <button class="btn btn-secondary" (click)="clearSearch()">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Books Table -->
      <div class="row mt-3">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div *ngIf="isLoading" class="text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div
                *ngIf="!isLoading && books.length === 0"
                class="text-center text-muted"
              >
                No books found
              </div>

              <div
                *ngIf="!isLoading && books.length > 0"
                class="table-responsive"
              >
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>ISBN</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Published Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let book of books">
                      <td>{{ book.title }}</td>
                      <td>{{ book.author }}</td>
                      <td>{{ book.isbn }}</td>
                      <td>{{ book.category }}</td>
                      <td>{{ book.quantity }}</td>
                      <td>{{ book.publishedDate | date : 'shortDate' }}</td>
                      <td>
                        <button
                          class="btn btn-sm btn-info me-2"
                          (click)="viewBook(book)"
                        >
                          View
                        </button>
                        <button
                          class="btn btn-sm btn-warning me-2"
                          (click)="editBook(book.id)"
                        >
                          Edit
                        </button>
                        <button
                          class="btn btn-sm btn-danger"
                          (click)="deleteBook(book.id)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book Details Modal -->
    <div
      *ngIf="selectedBook"
      class="modal d-block"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Book Details</h5>
            <button
              type="button"
              class="btn-close"
              (click)="closeModal()"
            ></button>
          </div>
          <div class="modal-body">
            <p><strong>Title:</strong> {{ selectedBook.title }}</p>
            <p><strong>Author:</strong> {{ selectedBook.author }}</p>
            <p><strong>ISBN:</strong> {{ selectedBook.isbn }}</p>
            <p><strong>Category:</strong> {{ selectedBook.category }}</p>
            <p><strong>Quantity:</strong> {{ selectedBook.quantity }}</p>
            <p>
              <strong>Published Date:</strong>
              {{ selectedBook.publishedDate | date : 'longDate' }}
            </p>
            <p>
              <strong>Description:</strong>
              {{ selectedBook.description || 'No description available' }}
            </p>
            <p>
              <strong>Created:</strong>
              {{ selectedBook.createdAt | date : 'short' }}
            </p>
            <p>
              <strong>Updated:</strong>
              {{ selectedBook.updatedAt | date : 'short' }}
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="closeModal()"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .navbar-brand {
        font-weight: bold;
      }
      .table th {
        background-color: #f8f9fa;
      }
      .modal {
        display: block !important;
      }
    `,
  ],
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null = null;
  currentUser: any;
  isLoading = false;

  searchTitle = '';
  searchAuthor = '';
  searchCategory = '';

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    this.isLoading = true;
    this.bookService
      .searchBooks(this.searchTitle, this.searchAuthor, this.searchCategory)
      .subscribe({
        next: (books) => {
          this.books = books;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching books:', error);
          this.isLoading = false;
        },
      });
  }

  clearSearch(): void {
    this.searchTitle = '';
    this.searchAuthor = '';
    this.searchCategory = '';
    this.loadBooks();
  }

  viewBook(book: Book): void {
    this.selectedBook = book;
  }

  editBook(id: number): void {
    this.router.navigate(['/books/edit', id]);
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.loadBooks();
        },
        error: (error) => {
          console.error('Error deleting book:', error);
          alert('Error deleting book. Please try again.');
        },
      });
    }
  }

  closeModal(): void {
    this.selectedBook = null;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
