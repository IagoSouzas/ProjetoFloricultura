export interface ItemAdicional {
  nomeItem: string;
  quantidade: number;
  dataAdicao: string;
}

// 1. Nova Interface para Endereço
export interface Endereco {
  cep: string;
  numero: number | null;
  complemento: string;
}

// Interface base do Usuário (se esta for a estrutura mínima para a API)
export interface Usuario {
  id?: number | string;
  email: string;
  senha: string;
  nome: string;
  itens_adicionais: ItemAdicional[];
  role: string;
}

// 2. Interface completa para uso no Formulário de Cadastro (inclui campos extras)
export interface UsuarioCompleto extends Usuario {
  cpf: string;
  endereco: Endereco;
}

export interface LoginResponse {
  id: number; 
  nome: string;
  role: string;
  email: string;
}