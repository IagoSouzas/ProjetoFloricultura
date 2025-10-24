import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Produto {
  id?: number; // O id é opcional ao cadastrar, mas necessário ao alterar
  nome_produto: string;
  categoria: string;
  especie: string;
  descricao: string;
  cor: string;
  condicoes_cultivo: string;
  qtd_estoque: number;
  preco: number;
  observacao: string;
  adicionar_imagem?: File; // File ou string para o path, dependendo da necessidade
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) { }

  // Método para cadastrar um novo produto (POST)

  cadastrarProduto(produto: Produto): Observable<Produto> {
    // O json-server irá adicionar o 'id' automaticamente
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  // Método para alterar um produto existente (PUT)
  alterarProduto(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  // Método para buscar um produto por ID (GET)
  getProdutoPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }
}
