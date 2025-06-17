import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, CreateBook, UpdateBook } from '../models/book.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5000/api/books';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createBook(book: CreateBook): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateBook(id: number, book: UpdateBook): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  searchBooks(title?: string, author?: string, category?: string): Observable<Book[]> {
    let params = new URLSearchParams();
    if (title) params.append('title', title);
    if (author) params.append('author', author);
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    const url = queryString ? `${this.apiUrl}/search?${queryString}` : `${this.apiUrl}/search`;
    
    return this.http.get<Book[]>(url, {
      headers: this.authService.getAuthHeaders()
    });
  }
}

