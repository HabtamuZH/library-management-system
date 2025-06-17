import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { BookService } from '../services/book.service';
import { AuthorService } from '../services/author.service';
import { AuthService } from '../services/auth.service';
import { CreateBook, UpdateBook, Book } from '../models/book.model';
import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
  ],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-navbar></app-navbar>

      <!-- Main Content -->
      <div class="container my-5 flex-grow-1">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8">
            <div class="card border-0 shadow-lg rounded-3">
              <div class="card-header bg-light border-0 px-4 py-3">
                <h3 class="mb-0 fw-bold">
                  {{ isEditMode ? 'Edit Book' : 'Add New Book' }}
                </h3>
              </div>
              <div class="card-body p-4">
                <form
                  #bookForm="ngForm"
                  (ngSubmit)="onSubmit()"
                  (ngModelChange)="formChanges()"
                >
                  <div class="row">
                    <!-- Title -->
                    <div class="col-md-6 mb-4">
                      <label for="title" class="form-label fw-semibold">
                        Title <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class="form-control form-control-lg transition-all"
                        id="title"
                        name="title"
                        [(ngModel)]="book.title"
                        required
                        maxlength="200"
                        pattern="^[a-zA-Z0-9s]+$"
                        #title="ngModel"
                        placeholder="Enter book title"
                        aria-describedby="titleError"
                      />
                      <div
                        *ngIf="title.invalid && (title.touched || title.dirty)"
                        class="text-danger mt-2 text-sm animate__animated animate__fadeIn"
                        id="titleError"
                      >
                        <small *ngIf="title.errors?.['required']"
                          >Title is required</small
                        >
                        <small *ngIf="title.errors?.['maxlength']"
                          >Title cannot exceed 200 characters</small
                        >
                        <small *ngIf="title.errors?.['pattern']"
                          >Title can only contain letters, numbers, and
                          spaces</small
                        >
                      </div>
                    </div>
                    <!-- Author -->
                    <div class="col-md-6 mb-4">
                      <label for="authorId" class="form-label fw-semibold">
                        Author <span class="text-danger">*</span>
                      </label>
                      <select
                        class="form-select form-select-lg transition-all"
                        id="authorId"
                        name="authorId"
                        [(ngModel)]="book.authorId"
                        required
                        (change)="onAuthorChange($event)"
                        #authorSelect="ngModel"
                        aria-describedby="authorError"
                      >
                        <option value="" disabled selected>
                          Select an author...
                        </option>
                        <option
                          *ngFor="let author of authors"
                          [value]="author.id"
                        >
                          {{ author.name }}
                        </option>
                      </select>
                      <div
                        *ngIf="
                          authorSelect.invalid &&
                          (authorSelect.touched || authorSelect.dirty)
                        "
                        class="text-danger mt-2 text-sm animate__animated animate__fadeIn"
                        id="authorError"
                      >
                        <small>Author is required</small>
                      </div>
                      <small class="form-text text-muted mt-2">
                        Don't see the author?
                        <a [routerLink]="['/authors/add']" class="text-primary"
                          >Add a new author</a
                        >
                        first.
                      </small>
                    </div>
                  </div>

                  <div class="row">
                    <!-- ISBN -->
                    <div class="col-md-6 mb-4">
                      <label for="isbn" class="form-label fw-semibold">
                        ISBN <span class="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        class="form-control form-control-lg transition-all"
                        id="isbn"
                        name="isbn"
                        [(ngModel)]="book.isbn"
                        pattern="^(?:\\d{10}|\\d{13})$"
                        #isbn="ngModel"
                        placeholder="e.g., 9781234567890"
                        aria-describedby="isbnError"
                      />
                      <div
                        *ngIf="isbn.invalid && (isbn.touched || isbn.dirty)"
                        class="text-danger mt-2 text-sm animate__animated animate__fadeIn"
                        id="isbnError"
                      >
                        <small *ngIf="isbn.errors?.['pattern']"
                          >ISBN must be 10 or 13 digits</small
                        >
                      </div>
                    </div>
                    <!-- Category -->
                    <div class="col-md-6 mb-4">
                      <label for="category" class="form-label fw-semibold">
                        Category <span class="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        class="form-control form-control-lg transition-all"
                        id="category"
                        name="category"
                        [(ngModel)]="book.category"
                        maxlength="100"
                        pattern="^[a-zA-Zs]+$"
                        #category="ngModel"
                        placeholder="e.g., Fiction, Science, History"
                        aria-describedby="categoryError"
                      />
                      <div
                        *ngIf="
                          category.invalid &&
                          (category.touched || category.dirty)
                        "
                        class="text-danger mt-2 text-sm animate__animated animate__fadeIn"
                        id="categoryError"
                      >
                        <small *ngIf="category.errors?.['pattern']"
                          >Category can only contain letters and spaces</small
                        >
                        <small *ngIf="category.errors?.['maxlength']"
                          >Category cannot exceed 100 characters</small
                        >
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <!-- Quantity -->
                    <div class="col-md-6 mb-4">
                      <label for="quantity" class="form-label fw-semibold">
                        Quantity <span class="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        class="form-control form-control-lg transition-all"
                        id="quantity"
                        name="quantity"
                        [(ngModel)]="book.quantity"
                        required
                        min="0"
                        #quantity="ngModel"
                        aria-describedby="quantityError"
                      />
                      <div
                        *ngIf="
                          quantity.invalid &&
                          (quantity.touched || quantity.dirty)
                        "
                        class="text-danger mt-2 text-sm animate__animated animate__fadeIn"
                        id="quantityError"
                      >
                        <small
                          >Quantity is required and must be 0 or greater</small
                        >
                      </div>
                    </div>
                    <!-- Published Date -->
                    <div class="col-md-6 mb-4">
                      <label for="publishedDate" class="form-label fw-semibold">
                        Published Date
                        <span class="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="date"
                        class="form-control form-control-lg transition-all"
                        id="publishedDate"
                        name="publishedDate"
                        [ngModel]="formatDateForInput(book.publishedDate)"
                        (ngModelChange)="updatePublishedDate($event)"
                        max="{{ maxDate }}"
                        #publishedDateInput="ngModel"
                        aria-describedby="publishedDateError"
                      />
                      <div
                        *ngIf="
                          publishedDateInput.invalid &&
                          (publishedDateInput.touched ||
                            publishedDateInput.dirty)
                        "
                        class="text-danger mt-2 text-sm animate__animated animate__fadeIn"
                        id="publishedDateError"
                      >
                        <small *ngIf="publishedDateInput.errors?.['max']"
                          >Date cannot be in the future</small
                        >
                      </div>
                    </div>
                    <!-- Renamed template to avoid conflict -->
                    <ng-template
                      #publishedDateTemplate
                      let-control="ngModel"
                    ></ng-template>
                  </div>

                  <!-- Description -->
                  <div class="mb-4">
                    <label for="description" class="form-label fw-semibold">
                      Description <span class="text-muted">(Optional)</span>
                    </label>
                    <textarea
                      class="form-control transition-all"
                      id="description"
                      name="description"
                      rows="4"
                      maxlength="1000"
                      [(ngModel)]="book.description"
                      placeholder="Brief description of the book..."
                      #description="ngModel"
                      aria-describedby="descriptionLength"
                    ></textarea>
                    <div class="form-text mt-2" id="descriptionLength">
                      {{ description.value?.length || 0 }} / 1000 characters
                      <span
                        *ngIf="description.value?.length > 900"
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
                      <i class="bi bi-arrow-left me-2"></i>Cancel
                    </button>
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg transition-all"
                      [disabled]="bookForm.invalid || isLoading"
                    >
                      <span
                        *ngIf="isLoading"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      <i *ngIf="!isLoading" class="bi bi-save me-2"></i>
                      {{
                        isLoading
                          ? 'Saving...'
                          : isEditMode
                          ? 'Update Book'
                          : 'Add Book'
                      }}
                    </button>
                  </div>
                </form>
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
        aria-modal="true"
        role="dialog"
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

      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: #f8f9fa;
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
      .form-control-lg,
      .form-select,
      .form-select-lg {
        border-radius: 0.375rem;
        border: 1px solid #ced4da;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .form-control:focus,
      .form-select:focus {
        border-color: #0d6efd;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
      }
      .form-control::placeholder,
      .form-select::placeholder {
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
        .form-control-lg,
        .form-select-lg {
          font-size: 0.9rem;
        }
      }
    `,
  ],
})
export class BookFormComponent implements OnInit, OnDestroy {
  @ViewChild('bookForm') form!: NgForm;

  book: CreateBook | UpdateBook = {
    title: '',
    author: '',
    isbn: '',
    publishedDate: undefined,
    quantity: 1,
    description: '',
    category: '',
    authorId: undefined,
  };

  authors: { id: number; name: string }[] = [];
  currentUser: any;
  isEditMode = false;
  bookId: number | null = null;
  errorMessage = '';
  isLoading = false;
  showCancelConfirm = false;
  formTouched = false;
  maxDate: string;
  private initialFormState: CreateBook | UpdateBook;
  private destroy$ = new Subject<void>();

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Set max date to today
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    this.initialFormState = { ...this.book };
  }

  ngOnInit(): void {
    // Check authentication
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Load authors
    this.loadAuthors();

    // Check if in edit mode
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.bookId = +params['id'];
        this.loadBook();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAuthors(): void {
    this.isLoading = true;
    this.authorService
      .getAuthorsForDropdown()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (authors) => {
          this.authors = authors;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading authors:', error);
          this.errorMessage =
            error.error?.message || 'Error loading authors for dropdown';
          this.isLoading = false;
        },
      });
  }

  loadBook(): void {
    if (this.bookId) {
      this.isLoading = true;
      this.bookService
        .getBook(this.bookId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (book: Book) => {
            this.book = {
              title: book.title,
              author: book.author,
              isbn: book.isbn,
              publishedDate: book.publishedDate,
              quantity: book.quantity,
              description: book.description,
              category: book.category,
              authorId: book.authorId,
            };
            this.initialFormState = { ...this.book };
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading book:', error);
            this.errorMessage =
              error.error?.message || 'Error loading book details';
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

  onAuthorChange(event: Event): void {
    const authorId = (event.target as HTMLSelectElement).value;
    if (authorId) {
      const selectedAuthor = this.authors.find((a) => a.id === +authorId);
      if (selectedAuthor) {
        this.book.author = selectedAuthor.name;
        this.book.authorId = +authorId;
      }
    } else {
      this.book.author = '';
      this.book.authorId = undefined;
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
      this.isEditMode && this.bookId
        ? this.bookService.updateBook(this.bookId, this.book as UpdateBook)
        : this.bookService.createBook(this.book as CreateBook);

    operation$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isLoading = false;
        this.formTouched = false;
        const navigationExtras: NavigationExtras = {
          state: {
            successMessage: this.isEditMode
              ? 'Book updated successfully'
              : 'Book created successfully',
          },
        };
        this.router.navigate(['/books'], navigationExtras);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          `Error ${this.isEditMode ? 'updating' : 'creating'} book`;
        console.error(
          `Error ${this.isEditMode ? 'updating' : 'creating'} book:`,
          error
        );
      },
    });
  }

  onCancel(): void {
    if (this.formTouched && this.hasChanges()) {
      this.showCancelConfirm = true;
    } else {
      this.navigateTo('/books');
    }
  }

  hasChanges(): boolean {
    return (
      this.book.title !== this.initialFormState.title ||
      this.book.author !== this.initialFormState.author ||
      this.book.isbn !== this.initialFormState.isbn ||
      (this.book.publishedDate?.getTime() !==
        this.initialFormState.publishedDate?.getTime() &&
        !(
          this.book.publishedDate === undefined &&
          this.initialFormState.publishedDate === undefined
        )) ||
      this.book.quantity !== this.initialFormState.quantity ||
      this.book.description !== this.initialFormState.description ||
      this.book.category !== this.initialFormState.category ||
      this.book.authorId !== this.initialFormState.authorId
    );
  }

  confirmCancel(): void {
    this.showCancelConfirm = false;
    this.formTouched = false;
    this.navigateTo('/books');
  }

  formatDateForInput(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  updatePublishedDate(value: string): void {
    this.book.publishedDate = value ? new Date(value) : undefined;
    this.formTouched = true;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
