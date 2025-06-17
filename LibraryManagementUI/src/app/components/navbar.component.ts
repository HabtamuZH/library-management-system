import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid px-3">
        <!-- Brand -->
        <a
          class="navbar-brand fw-bold d-flex align-items-center animate__animated animate__fadeIn"
          [routerLink]="['/dashboard']"
          role="link"
          aria-label="Library Management System Home"
        >
          <i class="bi bi-book me-2 fs-4"></i>
          <span class="brand-full">Library Management System</span>
          <span class="brand-short">LMS</span>
        </a>

        <!-- Toggler -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Content -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Navigation Links -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a
                class="nav-link transition-all"
                [routerLink]="['/dashboard']"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                role="link"
                aria-label="Go to Dashboard"
              >
                <i class="bi bi-speedometer2 me-1"></i>
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link transition-all"
                [routerLink]="['/books']"
                routerLinkActive="active"
                role="link"
                aria-label="Go to Books"
              >
                <i class="bi bi-book me-1"></i>
                Books
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link transition-all"
                [routerLink]="['/authors']"
                routerLinkActive="active"
                role="link"
                aria-label="Go to Authors"
              >
                <i class="bi bi-person-lines-fill me-1"></i>
                Authors
              </a>
            </li>
          </ul>

          <!-- User Info and Logout -->
          <div class="d-flex align-items-center flex-column flex-lg-row">
            <span
              class="navbar-text text-light me-lg-3 mb-2 mb-lg-0 animate__animated animate__fadeIn"
            >
              <i class="bi bi-person-circle me-1"></i>
              {{ currentUser?.username || 'Guest' }}
            </span>
            <button
              class="btn btn-outline-light btn-sm transition-all"
              (click)="logout()"
              aria-label="Logout"
            >
              <i class="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .navbar {
        background-color: #0d6efd;
        padding: 0.75rem 1rem;
        transition: background-color 0.3s ease;
      }

      .navbar-brand {
        font-size: 1.5rem;
        color: #ffffff !important;
        transition: transform 0.3s ease;
      }
      .navbar-brand:hover {
        transform: translateY(-2px);
      }
      .brand-full {
        display: inline;
      }
      .brand-short {
        display: none;
      }

      .nav-link {
        color: rgba(255, 255, 255, 0.9) !important;
        font-weight: 500;
        padding: 0.5rem 1rem;
        margin: 0.25rem;
        transition: color 0.3s ease, background-color 0.3s ease;
        border-radius: 0.25rem;
        font-size: 1rem;
      }
      .nav-link:hover {
        color: #ffffff !important;
        background-color: rgba(255, 255, 255, 0.1);
      }
      .nav-link.active {
        color: #ffffff !important;
        background-color: rgba(255, 255, 255, 0.2);
        font-weight: 600;
      }

      .btn-outline-light {
        border-color: rgba(255, 255, 255, 0.8);
        color: rgba(255, 255, 255, 0.9);
        padding: 0.5rem 1rem;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }
      .btn-outline-light:hover {
        background-color: #ffffff;
        color: #0d6efd !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .navbar-text {
        font-size: 0.95rem;
        color: #ffffff;
      }

      .bi {
        font-size: 1.2rem;
        vertical-align: middle;
      }

      .transition-all {
        transition: all 0.3s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate__animated.animate__fadeIn {
        animation: fadeIn 0.5s ease-out;
      }

      /* Mobile Responsiveness */
      @media (max-width: 991px) {
        .navbar {
          padding: 0.5rem 1rem;
        }
        .container-fluid {
          padding-left: 0.75rem;
          padding-right: 0.75rem;
        }
        .navbar-brand {
          font-size: 1.25rem;
        }
        .brand-full {
          display: none;
        }
        .brand-short {
          display: inline;
        }
        .navbar-nav {
          padding: 0.5rem 0;
          text-align: center;
        }
        .nav-link {
          font-size: 1.1rem;
          padding: 0.75rem 1rem;
          margin: 0.1rem 0;
        }
        .navbar-text {
          font-size: 1rem;
          padding: 0.5rem 1rem;
          text-align: center;
        }
        .btn-outline-light {
          margin: 0.75rem auto;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          width: 80%;
          max-width: 200px;
        }
        .d-flex {
          flex-direction: !important;
          align-items: center;
        }
        .navbar-collapse {
          background-color: #0d6efd;
          margin-top: 0.5rem;
          border-radius: 0.25rem;
          max-height: 80vh;
          overflow-y: auto;
        }
      }

      @media (max-width: 576px) {
        .navbar-brand {
          font-size: 1.1rem;
        }
        .bi {
          font-size: 1rem;
        }
        .nav-link {
          font-size: 1rem;
        }
        .btn-outline-light {
          width: 90%;
        }
      }
    `,
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: any;

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    // If you add an observable for auth state changes in AuthService, subscribe here.
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], {
      state: { successMessage: 'Successfully logged out' },
    });
  }
}
