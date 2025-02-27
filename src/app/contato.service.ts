import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface Contato {
  id?: string;
  nome: string;
  email: string;
  fone: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ContatoService {
  private apiUrl = 'http://localhost:3000/contatos';

  constructor(private http: HttpClient) { }

  getContatos(page: number = 1, pageSize: number = 5): Observable<PaginatedResponse<Contato>> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', pageSize.toString());

    return this.http.get<Contato[]>(this.apiUrl, {
      params,
      observe: 'response'
    }).pipe(
      map(response => {
        const items = response.body as Contato[];
        const total = Number(response.headers.get('x-total-count')) || 0;
        const totalPages = Math.ceil(total / pageSize) || 1;

        return { items, total, page, pageSize, totalPages };
      }),
      catchError(error => {
        console.error('Erro:', error);
        return throwError(() => new Error('Falha ao carregar contatos'));
      })
    );
  }

  getContatoById(id: string): Observable<Contato> {
    return this.http.get<Contato>(`${this.apiUrl}/${id}`);
  }

  criarContato(contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.apiUrl, contato);
  }

  atualizarContato(id: string, contato: Contato): Observable<Contato> {
    return this.http.put<Contato>(`${this.apiUrl}/${id}`, contato);
  }

  deletarContato(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
