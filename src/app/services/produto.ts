import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // Adicionado 'of' para retornar Observable de dados em cache
import { map } from 'rxjs/operators'; // Adicionado 'map'

interface Produto {
  id?: number; 
  nome_produto: string;
  categoria: string;
  especie: string;
  descricao: string;
  cor: string;
  condicoes_cultivo: string;
  qtd_estoque: number;
  preco: number;
  observacao: string;
  adicionar_imagem?: File;
}

// Interface obrigatória para o retorno com paginação
export interface PaginatedResult<T> {
  data: T[];
  totalItems: number; // Retorna o total para que o componente calcule as páginas
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos';

  // Cache interno para armazenar todos os produtos
  private allProducts: Produto[] = []; 
  private dataFetched = false;

  constructor(private http: HttpClient) { }

  // CORREÇÃO: Método para buscar (e paginar) produtos
  getProdutos(page: number, limit: number): Observable<PaginatedResult<Produto>> {
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Se os dados já foram buscados, usa o cache (Paginação Simples no Cliente)
    if (this.dataFetched) {
      const paginatedData = this.allProducts.slice(startIndex, endIndex);

      // Retorna um Observable do cache (sem fazer nova requisição HTTP)
      return of({
        data: paginatedData,
        totalItems: this.allProducts.length
      });
    }

    // Se é a primeira vez: Busca TODOS os produtos do servidor
    return this.http.get<Produto[]>(this.apiUrl).pipe( 
      map(products => {
        // 1. Armazena o conjunto de dados completo
        this.allProducts = products;
        this.dataFetched = true;

        const totalItems = products.length;
        
        // 2. Faz o corte para retornar a primeira página
        const paginatedData = products.slice(startIndex, endIndex);

        return {
          data: paginatedData,
          totalItems: totalItems
        };
      })
    );
  }

  // Métodos de CRUD (mantidos)
  cadastrarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  alterarProduto(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  getProdutoPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }
}