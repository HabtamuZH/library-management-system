export interface Author {
  id: number;
  name: string;
  biography?: string;
  createdAt: Date;
  updatedAt: Date;
  bookCount: number;
}

export interface CreateAuthor {
  name: string;
  biography?: string;
}

export interface UpdateAuthor {
  name: string;
  biography?: string;
}

export interface AuthorWithBooks {
  id: number;
  name: string;
  biography?: string;
  createdAt: Date;
  updatedAt: Date;
  books: Book[];
}

// Import Book interface
import { Book } from './book.model';

