import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { AuthorService } from '../services/author.service';
import { AuthService } from '../services/auth.service';
import { Author } from '../models/author.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarComponent } from './navbar.component'; 

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent], // Add NavbarComponent
  template: `
    <!-- Navigation Bar -->
    <app-navbar></app-navbar>

    <!-- Main Content -->
    <div class="container my-5">
      <!-- Success Message -->
      <div
        *ngIf="successMessage"
        class="alert alert-success alert-dismissible fade show animate__animated animate__fadeIn"
        role="alert"
      >
        {{ successMessage }}
        <button
          type="button"
          class="btn-close"
          (click)="successMessage = ''"
          aria-label="Close"
        ></button>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold mb-0">Authors Management</h2>
            <button
              class="btn btn-primary btn-lg transition-all"
              (click)="navigateTo('/authors/add')"
            >
              <i class="bi bi-plus-circle me-2"></i>Add New Author
            </button>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="row mb-4">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text bg-light border-0"
              ><i class="bi bi-search"></i
            ></span>
            <input
              type="text"
              class="form-control"
              placeholder="Search authors by name..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterAuthors()"
              aria-label="Search authors"
            />
          </div>
        </div>
      </div>

      <!-- Authors Table -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-lg rounded-3">
            <div class="card-body p-4">
              <!-- Loading State -->
              <div *ngIf="isLoading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Empty State -->
              <div
                *ngIf="!isLoading && filteredAuthors.length === 0"
                class="text-center text-muted py-5"
              >
                <i class="bi bi-exclamation-circle display-4 mb-3"></i>
                <p class="fs-5">
                  {{
                    searchQuery
                      ? 'No authors match your search.'
                      : 'No authors found. Add a new author to get started!'
                  }}
                </p>
              </div>

              <!-- Authors Table -->
              <div
                *ngIf="!isLoading && filteredAuthors.length > 0"
                class="table-responsive"
              >
                <table
                  class="table table-hover table-bordered align-middle"
                  role="grid"
                >
                  <thead class="table-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Biography</th>
                      <th scope="col">Books</th>
                      <th scope="col">Created</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      *ngFor="let author of paginatedAuthors; let i = index"
                      class="transition-all"
                    >
                      <td>{{ author.name }}</td>
                      <td>
                        {{
                          author.biography || 'No biography available'
                            | slice : 0 : 100
                        }}{{
                          (author.biography?.length || 0) > 100 ? '...' : ''
                        }}
                      </td>
                      <td>{{ author.bookCount }}</td>
                      <td>{{ author.createdAt | date : 'mediumDate' }}</td>
                      <td>
                        <div
                          class="btn-group"
                          role="group"
                          aria-label="Author actions"
                        >
                          <button
                            class="btn btn-sm btn-info me-1 transition-all"
                            (click)="viewAuthor(author)"
                            title="View Author"
                            aria-label="View Author"
                          >
                            <i class="bi bi-eye"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-warning me-1 transition-all"
                            (click)="editAuthor(author.id)"
                            title="Edit Author"
                            aria-label="Edit Author"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-danger transition-all"
                            (click)="openDeleteConfirm(author)"
                            [disabled]="author.bookCount > 0"
                            title="Delete Author"
                            aria-label="Delete Author"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- Pagination -->
                <nav
                  *ngIf="filteredAuthors.length > itemsPerPage"
                  class="d-flex justify-content-center mt-4"
                  aria-label="Authors pagination"
                >
                  <ul class="pagination">
                    <li class="page-item" [class.disabled]="currentPage === 1">
                      <button
                        class="page-link"
                        (click)="previousPage()"
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </button>
                    </li>
                    <li
                      class="page-item"
                      *ngFor="let page of pageNumbers"
                      [class.active]="page === currentPage"
                    >
                      <button class="page-link" (click)="goToPage(page)">
                        {{ page }}
                      </button>
                    </li>
                    <li
                      class="page-item"
                      [class.disabled]="currentPage === totalPages"
                    >
                      <button
                        class="page-link"
                        (click)="nextPage()"
                        aria-label="Next"
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Author Details Modal -->
    <div
      *ngIf="selectedAuthor"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
      aria-modal="true"
      role="dialog"
    >
      <div class="modal-dialog modal-lg">
        <div
          class="modal-content rounded-3 shadow-lg animate__animated animate__fadeIn"
        >
          <div class="modal-header border-0 bg-light">
            <h5 class="modal-title fw-medium">Author Details</h5>
            <button
              type="button"
              class="btn-close"
              (click)="closeModal()"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body p-4">
            <div class="row">
              <div class="col-12 mb-3">
                <strong class="d-block">Name</strong>
                <span>{{ selectedAuthor.name }}</span>
              </div>
              <div class="col-12 mb-3">
                <strong class="d-block">Biography</strong>
                <span>{{
                  selectedAuthor.biography || 'No biography available'
                }}</span>
              </div>
              <div class="col-12 mb-3">
                <strong class="d-block">Books Count</strong>
                <span>{{ selectedAuthor.bookCount }}</span>
              </div>
              <div class="col-12 mb-3">
                <strong class="d-block">Created</strong>
                <span>{{ selectedAuthor.createdAt | date : 'long' }}</span>
              </div>
              <div class="col-12">
                <strong class="d-block">Updated</strong>
                <span>{{ selectedAuthor.updatedAt | date : 'long' }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button
              type="button"
              class="btn btn-outline-secondary btn-lg transition-all"
              (click)="closeModal()"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary btn-lg transition-all"
              (click)="editAuthor(selectedAuthor.id)"
            >
              <i class="bi bi-pencil me-2"></i>Edit Author
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      *ngIf="showDeleteConfirm"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
      aria-modal="true"
      role="dialog"
    >
      <div class="modal-dialog">
        <div
          class="modal-content rounded-3 shadow-lg animate__animated animate__fadeIn"
        >
          <div class="modal-header border-0 bg-light">
            <h5 class="modal-title fw-medium">Confirm Deletion</h5>
            <button
              type="button"
              class="btn-close"
              (click)="showDeleteConfirm = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete {{ selectedAuthor?.name }}?
          </div>
          <div class="modal-footer border-0">
            <button
              type="button"
              class="btn btn-outline-secondary btn-lg transition-all"
              (click)="showDeleteConfirm = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger btn-lg transition-all"
              (click)="confirmDelete()"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: #f8f9fa;
      }

      .navbar {
        padding: 1rem 0;
        transition: all 0.3s ease;
      }
      .navbar-brand {
        font-size: 1.5rem;
        display: flex;
        align-items: center;
      }
      .navbar-text {
        font-size: 0.9rem;
      }
      .btn-outline-light {
        border-radius: 0.375rem;
        padding: 0.5rem 1rem;
      }

      .card {
        border-radius: 0.5rem;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
      }
      .card-body {
        background-color: #ffffff;
      }

      .input-group-text {
        background-color: #f8f9fa;
        border: 1px solid #ced4da;
        border-right: none;
      }
      .form-control {
        border-radius: 0.375rem;
        border: 1px solid #ced4da;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .form-control:focus {
        border-color: #0d6efd;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
      }

      .table {
        border-radius: 0.375rem;
        overflow: hidden;
      }
      .table th {
        background-color: #f1f3f5;
        font-weight: 600;
        color: #343a40;
      }
      .table td {
        vertical-align: middle;
      }
      .table-hover tbody tr:hover {
        background-color: #f8f9fa;
      }

      .btn {
        border-radius: 0.375rem;
        padding: 0.75rem 1.5rem;
        font-weight: 500;
      }
      .btn-primary {
        background-color: #0d6efd;
        border-color: #0d6efd;
      }
      .btn-primary:hover {
        background-color: #0b5ed7;
        border-color: #0a58ca;
      }
      .btn-outline-secondary {
        border-color: #6c757d;
        color: #6c757d;
      }
      .btn-outline-secondary:hover {
        background-color: #6c757d;
        color: #fff;
      }
      .btn-info,
      .btn-warning,
      .btn-danger {
        padding: 0.5rem 0.75rem;
      }
      .btn-danger {
        background-color: #dc3545;
        border-color: #dc3545;
      }
      .btn-danger:hover {
        background-color: #bb2d3b;
        border-color: #b02a37;
      }
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .transition-all {
        transition: all 0.3s ease;
      }

      .pagination .page-link {
        border-radius: 0.375rem;
        margin: 0 0.2rem;
        color: #0d6efd;
      }
      .pagination .page-item.active .page-link {
        background-color: #0d6efd;
        border-color: #0d6efd;
      }
      .pagination .page-item.disabled .page-link {
        color: #6c757d;
      }

      .modal-content {
        border-radius: 0.5rem;
        border: none;
      }
      .modal-header {
        background-color: #ffffff;
        border-bottom: 1px solid #e9ecef;
      }
      .modal-body {
        font-size: 1rem;
      }
      .modal-footer {
        background-color: #ffffff;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .animate__animated.animate__fadeIn {
        animation: fadeIn 0.3s ease-in;
      }

      @media (max-width: 768px) {
        .container {
          padding: 0 1rem;
        }
        .btn-lg {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }
        .navbar-brand {
          font-size: 1.25rem;
        }
        .table-responsive {
          font-size: 0.9rem;
        }
        .btn-group .btn {
          font-size: 0.8rem;
          padding: 0.4rem 0.6rem;
        }
        .pagination .page-link {
          padding: 0.5rem 0.75rem;
          font-size: 0.9rem;
        }
      }
    `,
  ],
})
export class AuthorsComponent implements OnInit, OnDestroy {
  authors: Author[] = [];
  filteredAuthors: Author[] = [];
  paginatedAuthors: Author[] = [];
  selectedAuthor: Author | null = null;
  currentUser: any;
  isLoading = false;
  successMessage = '';
  searchQuery = '';
  showDeleteConfirm = false;
  selectedAuthorId: number | null = null;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pageNumbers: number[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private authorService: AuthorService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Load authors
    this.loadAuthors();

    // Handle success message from navigation
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['successMessage']) {
      this.successMessage = navigation.extras.state['successMessage'];
      setTimeout(() => (this.successMessage = ''), 3000); // Auto-dismiss after 3 seconds
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAuthors(): void {
    this.isLoading = true;
    this.authorService
      .getAuthors()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (authors) => {
          this.authors = authors;
          this.filteredAuthors = authors;
          this.updatePagination();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading authors:', error);
          this.successMessage = '';
          this.isLoading = false;
          this.showError('Error loading authors. Please try again.');
        },
      });
  }

  filterAuthors(): void {
    this.searchQuery = this.searchQuery.trim();
    this.filteredAuthors = this.authors.filter((author) =>
      author.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.currentPage = 1; // Reset to first page on search
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(
      this.filteredAuthors.length / this.itemsPerPage
    );
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAuthors = this.filteredAuthors.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  viewAuthor(author: Author): void {
    this.selectedAuthor = author;
  }

  editAuthor(id: number): void {
    this.closeModal();
    this.router.navigate(['/authors/edit', id]);
  }

  openDeleteConfirm(author: Author): void {
    if (author.bookCount > 0) {
      this.showError(
        'Cannot delete author with associated books. Please reassign or delete the books first.'
      );
      return;
    }
    this.selectedAuthor = author;
    this.selectedAuthorId = author.id;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.selectedAuthorId) {
      this.isLoading = true;
      this.authorService
        .deleteAuthor(this.selectedAuthorId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showDeleteConfirm = false;
            this.selectedAuthorId = null;
            this.selectedAuthor = null;
            this.isLoading = false;
            this.successMessage = 'Author deleted successfully';
            setTimeout(() => (this.successMessage = ''), 3000);
            this.loadAuthors();
          },
          error: (error) => {
            console.error('Error deleting author:', error);
            this.isLoading = false;
            this.showDeleteConfirm = false;
            this.showError('Error deleting author. Please try again.');
          },
        });
    }
  }

  showError(message: string): void {
    this.successMessage = '';
    this.successMessage = message; // Using successMessage for errors too, styled as alert-danger
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  closeModal(): void {
    this.selectedAuthor = null;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
