import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="login-container d-flex align-items-center justify-content-center min-vh-100"
    >
      <div class="row justify-content-center w-100">
        <div class="col-sm-10 col-md-6 col-lg-4">
          <div
            class="card border-0 shadow-lg animate__animated animate__fadeIn"
          >
            <div
              class="card-header bg-primary text-white text-center py-4 rounded-top"
            >
              <h3 class="fw-bold mb-1">
                <i class="bi bi-book me-2"></i>Library Management System
              </h3>
              <h5 class="text-light mb-0">Admin Login</h5>
            </div>
            <div class="card-body p-4">
              <form #loginForm="ngForm" (ngSubmit)="onSubmit()">
                <!-- Username -->
                <div class="mb-3">
                  <label for="username" class="form-label fw-semibold">
                    Username <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control form-control-lg transition-all"
                      id="username"
                      name="username"
                      [(ngModel)]="credentials.username"
                      required
                      minlength="3"
                      #username="ngModel"
                      placeholder="Enter username"
                      aria-describedby="usernameError"
                    />
                  </div>
                  <div
                    *ngIf="
                      username.invalid && (username.touched || username.dirty)
                    "
                    class="text-danger text-sm mt-1 animate__animated animate__fadeIn"
                    id="usernameError"
                  >
                    <small *ngIf="username.errors?.['required']"
                      >Username is required</small
                    >
                    <small *ngIf="username.errors?.['minlength']"
                      >Username must be at least 3 characters</small
                    >
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label for="password" class="form-label fw-semibold">
                    Password <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      class="form-control form-control-lg transition-all"
                      id="password"
                      name="password"
                      [(ngModel)]="credentials.password"
                      required
                      minlength="6"
                      #password="ngModel"
                      placeholder="Enter password"
                      aria-describedby="passwordError"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      (click)="togglePassword()"
                      aria-label="Toggle password visibility"
                    >
                      <i
                        class="bi"
                        [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                      ></i>
                    </button>
                  </div>
                  <div
                    *ngIf="
                      password.invalid && (password.touched || password.dirty)
                    "
                    class="text-danger text-sm mt-1 animate__animated animate__fadeIn"
                    id="passwordError"
                  >
                    <small *ngIf="password.errors?.['required']"
                      >Password is required</small
                    >
                    <small *ngIf="password.errors?.['minlength']"
                      >Password must be at least 6 characters</small
                    >
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

                <!-- Submit Button -->
                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg transition-all"
                    [disabled]="loginForm.invalid || isLoading"
                    aria-label="Login"
                  >
                    <span
                      *ngIf="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    {{ isLoading ? 'Logging in...' : 'Login' }}
                  </button>
                </div>

                <!-- Default Credentials -->
                <div class="text-center text-muted">
                  <small>
                    Default credentials: <strong>admin / admin123</strong>
                  </small>
                </div>
              </form>
            </div>
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
      }

      .login-container {
        background: linear-gradient(135deg, #0d6efd 0%, #6c757d 100%);
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem;
      }

      .card {
        border-radius: 0.75rem;
        overflow: hidden;
        background-color: #ffffff;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
      }

      .card-header {
        background-color: #0d6efd;
        border-bottom: none;
        padding: 1.5rem;
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

      .input-group-text {
        background-color: #f8f9fa;
        border: 1px solid #ced4da;
        color: #6c757d;
      }

      .btn {
        border-radius: 0.375rem;
        padding: 0.75rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }
      .btn-primary {
        background-color: #0d6efd;
        border-color: #0d6efd;
      }
      .btn-primary:hover {
        background-color: #0b5ed7;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .btn-outline-secondary {
        border-color: #ced4da;
      }

      .text-sm {
        font-size: 0.85rem;
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

      @media (max-width: 576px) {
        .card {
          margin: 0 1rem;
        }
        .btn-lg {
          font-size: 0.9rem;
          padding: 0.5rem;
        }
        .form-control-lg {
          font-size: 0.9rem;
        }
        h3 {
          font-size: 1.5rem;
        }
        h5 {
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  credentials: LoginRequest = {
    username: '',
    password: '',
  };

  errorMessage = '';
  isLoading = false;
  showPassword = false;

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Redirect to dashboard if already authenticated
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .login(this.credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            'Login failed. Please check your credentials and try again.';
        },
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
