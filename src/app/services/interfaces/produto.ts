export interface Produto {
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
  imagem?: string; // agora é string (nome do arquivo salvo no servidor)
}