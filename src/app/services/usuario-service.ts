import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'; 
import { Router, RouterLink } from '@angular/router';
import { Usuario, LoginResponse } from './interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:3000';
  private usuariosUrl = `${this.apiUrl}/usuarios`;

  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.usuariosUrl, usuario);
  }
  login(email: string, senha: string): Observable<LoginResponse> {

    return this.http.get<Usuario[]>(`${this.usuariosUrl}?email=${email}`).pipe(

      map(usuarios => {

        if (usuarios.length !== 1) {
          throw new Error('Usuário não encontrado ou credenciais inválidas.');
        }

        const usuarioLogado = usuarios[0];

        if (usuarioLogado.senha !== senha) {
          throw new Error('Senha inválida.');
        }

        if (!usuarioLogado.role) {
          usuarioLogado.role = 'user';
        }

        return {
          id: usuarioLogado.id,
          nome: usuarioLogado.nome,
          role: usuarioLogado.role,
          email: usuarioLogado.email,
        } as LoginResponse;
      }),

      tap(response => {
        console.log('Login bem-sucedido. Role recebida:', response.role);

        if (response.role === 'admin') {
          this.router.navigate(['/admin/consultar']);
        } else {
          this.router.navigate(['/']);
        }
      }),

      catchError(error => {
        const errorMessage = error.message || 'Credenciais inválidas ou erro de conexão.';
        console.error('Erro de autenticação no Service:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}