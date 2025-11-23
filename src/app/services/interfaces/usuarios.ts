import {CarrinhoItem} from '../interfaces/produto'

// 1. Nova Interface para Endereço
export interface Endereco {
  cep: string;
  numero: number | null;
  complemento: string;
}

export interface Usuario {
  id?: string;                    // ← string, não number!
  nome: string;
  email: string;
  senha: string;
  role?: 'user' | 'admin';
  itens_adicionais: CarrinhoItem[];
}
// 2. Interface completa para uso no Formulário de Cadastro (inclui campos extras)
export interface UsuarioCompleto extends Usuario {
  cpf: string;
  endereco: Endereco;
}

export interface LoginResponse {
  id: string;                     // ← string aqui também!
  nome: string;
  email: string;
  role: 'user' | 'admin';
}