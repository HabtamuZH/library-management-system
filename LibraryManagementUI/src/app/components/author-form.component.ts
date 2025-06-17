import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorService } from '../services/author.service';
import { AuthService } from '../services/auth.service';
import {
  CreateAuthor,
  UpdateAuthor,
  AuthorWithBooks,
} from '../models/author.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <!-- Navigation Bar -->
    <app-navbar></app-navbar>

    <!-- Loading Overlay -->
    <div *ngIf="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Main Content -->
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card border-0 shadow-lg rounded-3">
            <div class="card-header bg-light border-0 px-4 py-3">
              <h3 class="mb-0">
                {{ isEditMode ? 'Edit Author' : 'Add New Author' }}
              </h3>
            </div>
            <div class="card-body p-4">
              <form
                #Form="ngForm"
                (ngSubmit)="onSubmit()"
                (ngModelChange)="formChanges()"
              >
                <!-- Name Input -->
                <div class="mb-4">
                  <label for="name" class="form-label fw-semibold"
                    >Author Name <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    id="name"
                    name="name"
                    class="form-control form-control-lg transition-all"
                    [(ngModel)]="author.name"
                    required
                    maxlength="100"
                    pattern="^[a-zA-Zs]+$"
                    placeholder="Enter author's name"
                    #nameInput="ngModel"
                  />
                  <div
                    *ngIf="
                      nameInput?.invalid &&
                      (nameInput?.touched || nameInput?.dirty)
                    "
                    class="text-danger mt-2 text-sm animate__animated animate__fadeIn"
                  >
                    <small *ngIf="nameInput.errors?.['required']"
                      >Name is required</small
                    >
                    <small *ngIf="nameInput.errors?.['maxlength']"
                      >Name cannot exceed 100 characters</small
                    >
                    <small *ngIf="nameInput.errors?.['pattern']"
                      >Name can only letters and spaces</small
                    >
                  </div>
                </div>

                <!-- Biography Input -->
                <div class="mb-4">
                  <label for="biography" class="form-label fw-semibold"
                    >Biography <span class="text-muted">(Optional)</span></label
                  >
                  <textarea
                    id="biography"
                    name="biography"
                    class="form-control transition-all"
                    rows="6"
                    maxlength="1000"
                    [(ngModel)]="author.biography"
                    placeholder="Enter author's biography"
                  >
                  </textarea>
                  <div class="form-text mt-2">
                    {{ author.biography?.length || 0 }} / 1000 characters
                    <span
                      *ngIf="(author.biography ?? '').length > 900"
                      class="text-warning ms-2"
                    >
                      Approaching limit
                    </span>
                  </div>
                </div>

                <!-- Error Message -->
                <div
                  *ngIf="errorMessage"
                  class="alert alert-danger alert-dismissible fade show animate__animated animate__fadeIn"
                  role="alert"
                >
                  {{ errorMessage }}
                  <button
                    type="button"
                    class="btn-close"
                    (click)="errorMessage = ''"
                    aria-label="Close"
                  ></button>
                </div>

                <!-- Form Actions -->
                <div
                  class="d-flex justify-content-between align-items-center mt-4"
                >
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-lg transition-all"
                    (click)="onCancel()"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg transition-all"
                    [disabled]="Form.invalid || isLoading"
                  >
                    <span
                      *ngIf="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    {{
                      isLoading
                        ? 'Saving...'
                        : isEditMode
                        ? 'Update Author'
                        : 'Add Author'
                    }}
                  </button>
                </div>
              </form>

              <!-- Books Table (Edit Mode) -->
              <div
                *ngIf="
                  isEditMode &&
                  authorWithBooks &&
                  authorWithBooks.books.length > 0
                "
                class="mt-5"
              >
                <h5 class="fw-semibold">
                  Books by {{ author.name }} ({{
                    authorWithBooks.books.length
                  }})
                </h5>
                <div class="table-responsive">
                  <table class="table table-hover table-bordered align-middle">
                    <thead class="table-light">
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Category</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Published Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        *ngFor="let book of authorWithBooks.books"
                        class="transition-all"
                      >
                        <td>{{ book.title }}</td>
                        <td>{{ book.category }}</td>
                        <td>{{ book.quantity }}</td>
                        <td>{{ book.publishedDate | date : 'mediumDate' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div
      *ngIf="showCancelConfirm"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog">
        <div
          class="modal-content rounded-3 shadow-lg animate__animated animate__fadeIn"
        >
          <div class="modal-header border-0 bg-light">
            <h5 class="modal-title fw-semibold">Unsaved Changes</h5>
            <button
              type="button"
              class="btn-close"
              (click)="showCancelConfirm = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            You have unsaved changes. Are you sure you want to cancel?
          </div>
          <div class="modal-footer border-0">
            <button
              type="button"
              class="btn btn-outline-secondary btn-lg transition-all"
              (click)="showCancelConfirm = false"
            >
              Stay
            </button>
            <button
              type="button"
              class="btn btn-danger btn-lg transition-all"
              (click)="confirmCancel()"
            >
              Discard
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
      .card-header {
        background-color: #ffffff;
        border-bottom: 1px solid #e9ecef;
      }
      .card-body {
        background-color: #ffffff;
      }

      .form-label {
        font-size: 0.95rem;
        color: #212529;
      }
      .form-control,
      .form-control-lg {
        border-radius: 0.375rem;
        border: 1px solid #ced4da;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .form-control:focus {
        border-color: #0d6efd;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
      }
      .form-control::placeholder {
        color: #6c757d;
        opacity: 0.7;
      }
      .form-text {
        font-size: 0.85rem;
        color: #6c757d;
      }
      .text-sm {
        font-size: 0.85rem;
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
      .btn-danger {
        background-color: #dc3545;
        border-color: #dc3545;
      }
      .btn-danger:hover {
        background-color: #bb2d3b;
        border-color: #b02a37;
      }
      .transition-all {
        transition: all 0.3s ease;
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

      .modal-content {
        border-radius: 0.5rem;
        border: none;
      }
      .modal-header {
        background-color: #ffffff;
        border-bottom: 1px solid #e9ecef;
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
      }
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
    `,
  ],
})
export class AuthorFormComponent implements OnInit {
  @ViewChild('Form') form!: NgForm;

  author: CreateAuthor | UpdateAuthor = {
    name: '',
    biography: '',
  };

  currentUser: any;
  isEditMode = false;
  authorId: number | null = null;
  authorWithBooks: AuthorWithBooks | null = null;
  errorMessage = '';
  isLoading = false;
  showCancelConfirm = false;
  formTouched = false;
  private initialFormState: CreateAuthor | UpdateAuthor = {
    name: '',
    biography: '',
  };
  private destroy$ = new Subject<void>();

  constructor(
    private authorService: AuthorService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if in edit mode
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.authorId = +params['id'];
        this.loadAuthor();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAuthor(): void {
    if (this.authorId) {
      this.isLoading = true;
      this.authorService.getAuthor(this.authorId).subscribe({
        next: (author: AuthorWithBooks) => {
          this.authorWithBooks = author;
          this.author = {
            name: author.name,
            biography: author.biography,
          };
          this.initialFormState = { ...this.author };
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading author:', error);
          this.errorMessage =
            error.error?.message || 'Error loading author details';
          this.isLoading = false;
        },
      });
    }
  }

  formChanges(): void {
    if (this.form.dirty) {
      this.formTouched = true;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const operation$: Observable<any> =
      this.isEditMode && this.authorId
        ? this.authorService.updateAuthor(
            this.authorId,
            this.author as UpdateAuthor
          )
        : this.authorService.createAuthor(this.author as CreateAuthor);

    operation$.subscribe({
      next: () => {
        this.isLoading = false;
        this.formTouched = false;
        this.router.navigate(['/authors'], {
          state: {
            successMessage: this.isEditMode
              ? 'Author updated successfully'
              : 'Author created successfully',
          },
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          `Error ${this.isEditMode ? 'updating' : 'creating'} author`;
        console.error(
          `Error ${this.isEditMode ? 'updating' : 'creating'} author:`,
          error
        );
      },
    });
  }

  onCancel(): void {
    if (
      this.formTouched &&
      (this.author.name !== this.initialFormState.name ||
        this.author.biography !== this.initialFormState.biography)
    ) {
      this.showCancelConfirm = true;
    } else {
      this.navigateTo('/authors');
    }
  }

  confirmCancel(): void {
    this.showCancelConfirm = false;
    this.formTouched = false;
    this.navigateTo('/authors');
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
