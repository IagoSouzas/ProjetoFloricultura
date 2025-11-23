import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../services/interfaces/usuarios';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private usuariosUrl = 'http://localhost:3000/usuarios';

  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.usuariosUrl, usuario);
  }

  // Se precisar de Login:
  /*
  fazerLogin(credenciais: { email: string, senha: string }): Observable<Usuario[]> {
    // Para Login com json-server, você usa uma query de filtro:
    return this.http.get<Usuario[]>(`${this.usuariosUrl}?email=${credenciais.email}&senha=${credenciais.senha}`);
  }
  */
}