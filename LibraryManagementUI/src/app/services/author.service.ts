import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author, CreateAuthor, UpdateAuthor, AuthorWithBooks } from '../models/author.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = 'http://localhost:5000/api/authors';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getAuthorsForDropdown(): Observable<{id: number, name: string}[]> {
    return this.http.get<{id: number, name: string}[]>(`${this.apiUrl}/dropdown`);
  }

  getAuthor(id: number): Observable<AuthorWithBooks> {
    return this.http.get<AuthorWithBooks>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createAuthor(author: CreateAuthor): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateAuthor(id: number, author: UpdateAuthor): Observable<Author> {
    return this.http.put<Author>(`${this.apiUrl}/${id}`, author, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteAuthor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}

