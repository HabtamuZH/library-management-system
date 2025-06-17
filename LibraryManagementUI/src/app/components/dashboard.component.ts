import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BookService } from '../services/book.service';
import { UserService } from '../services/user.service';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';
import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-navbar></app-navbar>

      <div class="container my-5 flex-grow-1">
        <!-- Header -->
        <div class="row animate__animated animate__fadeIn">
          <div class="col-12">
            <h2 class="fw-bold">
              <i class="bi bi-speedometer2 me-2"></i>Dashboard
            </h2>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="row mt-4 g-3">
          <div class="col-12 col-md-6 col-lg-3">
            <div class="card text-white bg-info shadow-lg transition-all">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="card-title">Total Books</h5>
                    <h2 class="mb-0">{{ totalBooks }}</h2>
                  </div>
                  <i class="bi bi-book fs-2"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="card text-white bg-success shadow-lg transition-all">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="card-title">Available Books</h5>
                    <h2 class="mb-0">{{ availableBooks }}</h2>
                  </div>
                  <i class="bi bi-check-circle fs-2"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="card text-white bg-warning shadow-lg transition-all">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="card-title">Categories</h5>
                    <h2 class="mb-0">{{ totalCategories }}</h2>
                  </div>
                  <i class="bi bi-tags fs-2"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="card text-white bg-secondary shadow-lg transition-all">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="card-title">Total Users</h5>
                    <h2 class="mb-0">{{ totalUsers }}</h2>
                  </div>
                  <i class="bi bi-people fs-2"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions and Recent Books -->
        <div class="row mt-4 g-3">
          <div class="col-12 col-md-6">
            <div
              class="card border-0 shadow-lg animate__animated animate__fadeIn"
            >
              <div
                class="card-header bg-light d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0">
                  <i class="bi bi-bolt me-2"></i>Quick Actions
                </h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button
                    class="btn btn-primary btn-lg transition-all"
                    (click)="navigateTo('/books')"
                  >
                    <i class="bi bi-book me-2"></i>Manage Books
                  </button>
                  <button
                    class="btn btn-success btn-lg transition-all"
                    (click)="navigateTo('/authors')"
                  >
                    <i class="bi bi-person-lines-fill me-2"></i>Manage Authors
                  </button>
                  <button
                    class="btn btn-info btn-lg transition-all"
                    (click)="navigateTo('/books/add')"
                  >
                    <i class="bi bi-plus-circle me-2"></i>Add New Book
                  </button>
                  <button
                    class="btn btn-warning btn-lg transition-all"
                    (click)="navigateTo('/authors/add')"
                  >
                    <i class="bi bi-person-plus me-2"></i>Add New Author
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div
              class="card border-0 shadow-lg animate__animated animate__fadeIn"
            >
              <div class="card-header bg-light">
                <h5 class="mb-0">
                  <i class="bi bi-clock me-2"></i>Recent Books
                </h5>
              </div>
              <div class="card-body">
                <div
                  *ngIf="recentBooks.length === 0"
                  class="text-muted text-center py-4"
                >
                  <i class="bi bi-book-open fs-1 mb-3"></i>
                  <p class="fs-5">No books available</p>
                </div>
                <div
                  *ngFor="let book of recentBooks"
                  class="mb-3 p-2 border-start border-primary border-3 transition-all"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <span
                      ><strong>{{ book.title }}</strong></span
                    >
                    <span class="badge bg-primary">{{ book.quantity }}</span>
                  </div>
                  <small class="text-muted">by {{ book.author }}</small>
                  <div *ngIf="book.category" class="mt-1">
                    <small class="badge bg-secondary">{{
                      book.category
                    }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background-color: #f8f9fa;
      }

      .container {
        max-width: 1400px;
        padding: 0 1rem;
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

      .card-header {
        border-bottom: 1px solid #e9ecef;
        background-color: #ffffff;
      }

      .card-body {
        padding: 1.5rem;
      }

      .btn {
        border-radius: 0.375rem;
        padding: 0.75rem 1.5rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .btn-lg {
        font-size: 1rem;
      }

      .badge {
        font-size: 0.85rem;
        padding: 0.5rem 0.75rem;
      }

      .border-start.border-primary {
        transition: border-color 0.3s ease;
      }
      .border-start.border-primary:hover {
        border-color: #0b5ed7;
      }

      .bi {
        vertical-align: middle;
      }

      .transition-all {
        transition: all 0.3s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate__animated.animate__fadeIn {
        animation: fadeIn 0.5s ease-out;
      }

      /* Mobile-specific styles */
      @media (max-width: 991px) {
        .my-5 {
          margin-top: 2rem !important;
          margin-bottom: 2rem !important;
        }
        .card-body {
          padding: 1rem;
        }
        .btn-lg {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
        }
        h2 {
          font-size: 1.5rem;
        }
        h5 {
          font-size: 1rem;
        }
        .fs-2 {
          font-size: 1.5rem !important;
        }
        .fs-1 {
          font-size: 2rem !important;
        }
        .fs-5 {
          font-size: 0.9rem !important;
        }
      }

      @media (max-width: 576px) {
        .container {
          padding: 0 0.75rem;
        }
        .card {
          margin-bottom: 1rem;
        }
        .btn-lg {
          font-size: 0.85rem;
          padding: 0.5rem 0.75rem;
        }
        h2 {
          font-size: 1.25rem;
        }
        h5 {
          font-size: 0.9rem;
        }
        .fs-2 {
          font-size: 1.25rem !important;
        }
        .badge {
          font-size: 0.75rem;
          padding: 0.4rem 0.6rem;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any;
  totalBooks = 0;
  availableBooks = 0;
  totalCategories = 0;
  totalUsers = 0;
  recentBooks: Book[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    // Load books
    this.bookService
      .getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (books) => {
          this.totalBooks = books.length;
          this.availableBooks = books.reduce(
            (sum, book) => sum + book.quantity,
            0
          );
          this.totalCategories = new Set(
            books.map((book) => book.category).filter((cat) => cat)
          ).size;
          this.recentBooks = books.slice(0, 5);
        },
        error: (error) => console.error('Error loading books:', error),
      });

    // Load users
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.totalUsers = users.length;
        },
        error: (error) => console.error('Error loading users:', error),
      });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
