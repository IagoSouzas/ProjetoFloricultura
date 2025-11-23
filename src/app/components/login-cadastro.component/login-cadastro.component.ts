import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
// Importações ESSENCIAIS para componentes standalone que usam formulários
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Header } from '../header/header';
import { UsuarioService } from '../../services/usuario-service';
// Importa todas as interfaces para tipagem correta
import { Usuario, UsuarioCompleto, Endereco } from '../../services/interfaces/usuarios';


@Component({
  selector: 'app-login-cadastro.component',
  standalone: true,
  // CORREÇÃO: Adicionando CommonModule e FormsModule para usar *ngIf e [(ngModel)]
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './login-cadastro.component.html',
  styleUrl: './login-cadastro.component.css'
})
export class LoginCadastroComponent implements OnInit {
  constructor(private router: Router) { }

  private usuarioService = inject(UsuarioService);

  // CORREÇÃO: Usando a interface UsuarioCompleto que inclui CPF e Endereço
  public novoUsuario: UsuarioCompleto = {
    nome: '',
    email: '',
    senha: '',
    // Campos adicionados para o formulário
    cpf: '',
    endereco: {
      cep: '',
      numero: null, // null é melhor para inputs number vazios
      complemento: ''
    },
    itens_adicionais: []
  };

  // Objeto separado para login, usando apenas os campos necessários da interface Usuario
  public loginDados = {
    email: '',
    senha: ''
  }

  public statusMensagem: string = '';
  public isSucesso: boolean | null = null;

  ngOnInit(): void {
    // Inicialização, se necessário
  }

  /**
   * Método chamado ao submeter o formulário de cadastro.
   */
  onSubmitCadastro(): void {
    this.statusMensagem = 'Cadastrando usuário...';
    this.isSucesso = null;

    // NOTA: Se o seu backend espera apenas a interface 'Usuario', 
    // você precisará filtrar os campos aqui antes de chamar o service.

    // Exemplo: chamando o service com o objeto completo (se o backend aceitar)
    this.usuarioService.cadastrarUsuario(this.novoUsuario).subscribe({
      next: (usuarioCadastrado) => {
        this.isSucesso = true;
        this.statusMensagem = `Usuário '${usuarioCadastrado.nome}' cadastrado com sucesso!`;
        alert('Usuário Cadastrado');

        // Limpa o formulário e muda para a tela de login
        this.novoUsuario = {
          nome: '', email: '', senha: '', cpf: '', itens_adicionais: [],
          endereco: { cep: '', numero: null, complemento: '' }
        };
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSucesso = false;
        this.statusMensagem = 'Erro ao cadastrar. Verifique o console para detalhes.';
        console.error('Erro de Cadastro:', error);
      }
    });
  }

  // onSubmitLogin(): void {
  //   this.statusMensagem = `Tentando login com ${this.loginDados.email}...`;
  //   this.isSucesso = null;
  //   // Lógica de autenticação viria aqui, usando this.loginDados.email e this.loginDados.senha
  //   this.usuarioService.login(this.loginDados.email, this.loginDados.senha).subscribe({
  //     next: (usuarioLogado) => {
  //       this.isSucesso = true;
  //       this.statusMensagem = `Login de ${usuarioLogado.nome} realizado com sucesso!`;
  //       this.router.navigate(['/home']); // Redireciona
  //     },
  //     error: (error) => {
  //       this.isSucesso = false;
  //       this.statusMensagem = 'Erro de login: E-mail ou senha incorretos.';
  //       console.error('Erro de Login:', error);
  //     }
  //   });
  // }
}