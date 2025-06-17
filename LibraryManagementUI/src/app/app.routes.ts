import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { BooksComponent } from './components/books.component';
import { BookFormComponent } from './components/book-form.component';
import { AuthorsComponent } from './components/authors.component';
import { AuthorFormComponent } from './components/author-form.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'books', component: BooksComponent, canActivate: [AuthGuard] },
  { path: 'books/add', component: BookFormComponent, canActivate: [AuthGuard] },
  { path: 'books/edit/:id', component: BookFormComponent, canActivate: [AuthGuard] },
  { path: 'authors', component: AuthorsComponent, canActivate: [AuthGuard] },
  { path: 'authors/add', component: AuthorFormComponent, canActivate: [AuthGuard] },
  { path: 'authors/edit/:id', component: AuthorFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];
