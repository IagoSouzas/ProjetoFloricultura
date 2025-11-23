import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// 💡 Correção de path: Voltando ao caminho original, mas garantindo que seja 'header' (sem .component)
import { Header } from '../header/header'; 
// 💡 Correção de path: Voltando ao caminho original (duas pastas acima)
import { UsuarioService } from '../../services/usuario-service';
// 💡 Correção de path: Ajustando o caminho da interface para ser consistente com o serviço
import { LoginResponse } from '../../services/interfaces/usuarios'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, Header],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginError: string = '';

  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  formulario = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.nullValidator]), 
    password: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    this.loginError = '';

    if (this.formulario.invalid) {
      this.loginError = 'Por favor, preencha o E-mail/CPF e a Senha corretamente.';
      this.formulario.markAllAsTouched();
      return;
    }

    const username = this.formulario.value.username as string;
    const password = this.formulario.value.password as string;

    this.usuarioService.login(username, password).subscribe({
      next: (dadosUsuario: LoginResponse) => {
        console.log(`Login bem-sucedido. Usuário: ${dadosUsuario.nome || dadosUsuario.email}`);
        this.loginError = ''; 
      },
      error: (err: Error) => {
        // Trata o erro (exibe a mensagem de erro que veio do service)
        this.loginError = err.message || 'Erro desconhecido ao tentar acessar. Verifique a conexão.';
        console.error('Erro de Login no Componente:', err);
      }
    });
  }
}