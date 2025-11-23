import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Produto } from './interfaces/produto';


export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos';

  private allProducts: Produto[] = [];
  private dataFetched = false;

  constructor(private http: HttpClient) { }

  getProdutos(page: number, limit: number): Observable<PaginatedResult<Produto>> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return this.http.get<Produto[]>(this.apiUrl).pipe(
      map(products => {
        this.allProducts = products;
        this.dataFetched = true;

        const totalItems = products.length;
        const paginatedData = products.slice(startIndex, endIndex);

        return { data: paginatedData, totalItems };
      })
    );
  }
  
  getProdutosAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  cadastrarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  cadastrarProdutoComImagem(formData: FormData): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, formData);
  }

  alterarProduto(id: string, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  alterarProdutoComImagem(id: string, formData: FormData): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, formData);
  }

  getProdutoPorId(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  deletarProduto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}