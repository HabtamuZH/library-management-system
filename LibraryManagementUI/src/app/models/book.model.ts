export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedDate?: Date;
  quantity: number;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  authorId?: number;
  authorName?: string;
}

export interface CreateBook {
  title: string;
  author: string;
  isbn: string;
  publishedDate?: Date;
  quantity: number;
  description: string;
  category: string;
  authorId?: number;
}

export interface UpdateBook {
  title: string;
  author: string;
  isbn: string;
  publishedDate?: Date;
  quantity: number;
  description: string;
  category: string;
  authorId?: number;
}

