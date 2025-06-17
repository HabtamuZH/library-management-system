import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-dark text-light py-4 mt-auto">
      <div class="container">
        <div class="row g-4">
          <!-- Library Info -->
          <div class="col-md-6 col-lg-4">
            <h5
              class="fw-semibold text-primary animate__animated animate__fadeIn"
            >
              <i class="bi bi-book me-2"></i>
              Library Management System
            </h5>
            <p class="text-muted mb-0">
              Efficiently manage your library's books and authors with our
              comprehensive, user-friendly system.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="col-md-3 col-lg-4">
            <h6
              class="fw-semibold text-primary animate__animated animate__fadeIn"
            >
              Quick Links
            </h6>
            <ul class="list-unstyled">
              <li class="mb-2">
                <a
                  [routerLink]="['/dashboard']"
                  class="text-light text-decoration-none transition-all d-flex align-items-center"
                  role="link"
                  aria-label="Go to Dashboard"
                >
                  <i class="bi bi-speedometer2 me-2"></i> Dashboard
                </a>
              </li>
              <li class="mb-2">
                <a
                  [routerLink]="['/books']"
                  class="text-light text-decoration-none transition-all d-flex align-items-center"
                  role="link"
                  aria-label="Go to Books"
                >
                  <i class="bi bi-book me-2"></i> Books
                </a>
              </li>
              <li class="mb-2">
                <a
                  [routerLink]="['/authors']"
                  class="text-light text-decoration-none transition-all d-flex align-items-center"
                  role="link"
                  aria-label="Go to Authors"
                >
                  <i class="bi bi-person-lines-fill me-2"></i> Authors
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="col-md-3 col-lg-4">
            <h6
              class="fw-semibold text-primary animate__animated animate__fadeIn"
            >
              Contact Info
            </h6>
            <ul class="list-unstyled text-muted">
              <li class="mb-2 d-flex align-items-center">
                <i class="bi bi-envelope me-2"></i>
                <a
                  href="mailto:info@library.com"
                  class="text-light text-decoration-none transition-all"
                  aria-label="Email us"
                >
                  info&#64;library.com
                </a>
              </li>
              <li class="mb-2 d-flex align-items-center">
                <i class="bi bi-telephone me-2"></i>
                <a
                  href="tel:+15551234567"
                  class="text-light text-decoration-none transition-all"
                  aria-label="Call us"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li class="mb-2 d-flex align-items-center">
                <i class="bi bi-geo-alt me-2"></i>
                123 Library St, Book City
              </li>
            </ul>
          </div>
        </div>

        <!-- Divider -->
        <hr class="my-4 border-secondary" />

        <!-- Copyright and Tech Stack -->
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0 text-muted">
              © {{ currentYear }} Library Management System. All rights
              reserved.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0 text-muted">
              <i class="bi bi-code-slash me-2"></i>
              Built with Angular & .NET Core
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      footer {
        background-color: #212529;
        margin-top: auto;
        font-size: 0.95rem;
      }

      h5,
      h6 {
        color: #0d6efd !important;
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }

      a {
        transition: color 0.3s ease, transform 0.3s ease;
      }
      a:hover {
        color: #0d6efd !important;
        transform: translateX(5px);
      }

      .text-muted {
        color: #adb5bd !important;
      }

      .bi {
        font-size: 1.2rem;
        opacity: 0.9;
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

      hr {
        border-color: #495057;
        opacity: 0.5;
      }

      @media (max-width: 768px) {
        footer {
          font-size: 0.85rem;
        }
        h5,
        h6 {
          font-size: 1rem;
        }
        .bi {
          font-size: 1rem;
        }
        .row {
          text-align: center;
        }
        .text-md-end {
          text-align: center !important;
        }
        a:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
