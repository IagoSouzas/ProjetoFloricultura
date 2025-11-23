import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario, LoginResponse } from './interfaces/usuarios';
import { CarrinhoItem, Produto } from './interfaces/produto';

const USER_ID_KEY = 'currentUserId';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000';
  private usuariosUrl = `${this.apiUrl}/usuarios`;

  // Salva no localStorage como string (porque ID é string)
  loginLocal(userId: string): void {
    localStorage.setItem(USER_ID_KEY, userId);
    console.log(`Usuário logado com ID: ${userId}`);
  }

  getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  }

  logout(): void {
    localStorage.removeItem(USER_ID_KEY);
    this.router.navigate(['/login']);
  }

  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    const novoUsuario = {
      ...usuario,
      itens_adicionais: usuario.itens_adicionais || [],
      role: usuario.role || 'user'
    };
    return this.http.post<Usuario>(this.usuariosUrl, novoUsuario).pipe(
      catchError(this.handleHttpError)
    );
  }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.get<Usuario[]>(`${this.usuariosUrl}?email=${email}`).pipe(
      map(usuarios => {
        if (usuarios.length === 0 || usuarios[0].senha !== senha) {
          throw new Error('Credenciais inválidas');
        }

        const usuario = usuarios[0];
        const userId = usuario.id!; // ← id é string

        this.loginLocal(userId); // ← agora aceita string

        return {
          id: userId,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role || 'user'
        };
      }),
      tap(response => {
        console.log('Login OK → Role:', response.role);
        if (response.role === 'admin') {
          this.router.navigate(['/admin/consultar']);
        } else {
          this.router.navigate(['/']);
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  getUsuarioPorId(userId: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.usuariosUrl}/${userId}`).pipe(
      catchError(this.handleHttpError)
    );
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    if (!usuario.id) throw new Error('Usuário sem ID');
    return this.http.put<Usuario>(`${this.usuariosUrl}/${usuario.id}`, usuario).pipe(
      catchError(this.handleHttpError)
    );
  }

  getUsuarioCarrinho(userId: string): Observable<CarrinhoItem[]> {
    return this.getUsuarioPorId(userId).pipe(
      map(usuario => usuario.itens_adicionais || [])
    );
  }
  removerItemDoCarrinho(idProduto: string): Observable<void> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('Usuário não logado'));
    }

    return this.getUsuarioPorId(userId).pipe(
      map(usuario => {
        let carrinho: CarrinhoItem[] = usuario.itens_adicionais || [];

        const indiceItem = carrinho.findIndex(item => item.id_produto === idProduto);

        if (indiceItem === -1) {
          console.log('Item não encontrado no carrinho:', idProduto);
          return usuario; // nada a fazer
        }

        // Diminui a quantidade
        carrinho[indiceItem].quantidade -= 1;

        // Se chegou a zero, remove o item completamente
        if (carrinho[indiceItem].quantidade <= 0) {
          console.log('Quantidade zerada → removendo item do carrinho:', idProduto);
          carrinho.splice(indiceItem, 1);
        } else {
          console.log(`Quantidade atualizada para ${carrinho[indiceItem].quantidade}`);
        }

        usuario.itens_adicionais = carrinho;
        return usuario;
      }),
      tap(usuarioAtualizado => {
        this.updateUsuario(usuarioAtualizado).subscribe({
          next: () => console.log('Carrinho atualizado com sucesso (item diminuído/removido)'),
          error: (err) => console.error('Erro ao salvar carrinho:', err)
        });
      }),
      map(() => void 0),
      catchError(this.handleHttpError)
    );
  }

  adicionarItemAoCarrinho(produto: Produto): Observable<void> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('Usuário não logado'));
    }

    return this.getUsuarioPorId(userId).pipe(
      map(usuario => {
        let carrinho: CarrinhoItem[] = usuario.itens_adicionais || [];

        const itemExistente = carrinho.find(item => item.id_produto === produto.id);
        if (itemExistente) {
          itemExistente.quantidade += 1;
        } else {
          const novoItem: CarrinhoItem = {
            id_produto: produto.id!,
            nome_produto: produto.nome_produto,
            preco_unitario: produto.preco,
            quantidade: 1,
            imagem: produto.imagem || ''
          };
          carrinho.push(novoItem);
        }

        usuario.itens_adicionais = carrinho;
        return usuario;
      }),
      tap(usuarioAtualizado => {
        this.updateUsuario(usuarioAtualizado).subscribe();
      }),
      map(() => void 0),
      catchError(this.handleHttpError)
    );
  }

  private handleHttpError(error: any) {
    console.error('Erro no UsuarioService:', error);
    const msg = error.status === 404 ? 'Usuário não encontrado' : 'Erro no servidor';
    return throwError(() => new Error(msg));
  }
}