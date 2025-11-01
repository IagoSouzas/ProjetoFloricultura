import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutoService, PaginatedResult } from '../../services/produto';
import { HttpClientModule } from '@angular/common/http'; // CORREÇÃO: Necessário para componentes standalone que usam serviços HTTP


interface Produto {
  id?: number;
  nome_produto: string;
  categoria: string;
  qtd_estoque: number;
}

interface TermosBusca {
  nome_produto?: string;
  categoria?: string;
}

@Component({
  selector: 'app-admin-produto.component',
  // CORREÇÃO: Adicionado HttpClientModule para resolver o erro de provedor
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-produto.component.html',
  styleUrl: './admin-produto.component.css'
})
export class AdminProdutoComponent implements OnInit {

  // imagem
  imagemBackground = 'assets/imagens/flor_background.svg'

  // Dados para os campos de busca, reestruturado para ser mais simples
  public buscaCampos = [
    { label: 'Nome do Produto: ', id: 'nome_produto', type: 'text' },
    { label: 'Categoria: ', id: 'categoria', type: 'text' }
  ];

  // Cabeçalho da tabela
  public HEADER = ["COD", "NOME", "Categoria", "Estoque", ""];


  public paginaAtual: number = 1;
  public totalItens: number = 0;
  public limitePorPagina: number = 5;

  public items: Produto[] = [];

  constructor(private router: Router, private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  private carregarProdutos(): void {
    // O serviço agora retorna o corte (slice) do array completo
    this.produtoService.getProdutos(this.paginaAtual, this.limitePorPagina)
      .subscribe({
        next: (result: PaginatedResult<Produto>) => {
          this.items = result.data.map(p => ({
            id: p.id,
            nome_produto: p.nome_produto,
            categoria: p.categoria,
            qtd_estoque: p.qtd_estoque
          }));
          this.totalItens = result.totalItems;
        },
        error: (err) => {
          console.error('Erro ao carregar produtos:', err);
          alert('Não foi possível carregar os dados do servidor.');
        }
      });
  }

  public onBuscarSugestao(): void {
    // Ao digitar, sempre voltamos para a primeira página para ver os resultados do filtro
    this.paginaAtual = 1;
    this.carregarProdutos();
  }

  public adicionarNovoProduto(): void {
    this.router.navigate(['admin/cadastrar-produto']);
  }

  public editarProduto(item: Produto): void {
    this.router.navigate(['admin/alterar-produto', item.id]);
  }

  public deletarProduto(id: number | undefined): void {
    if (!id) {
      alert("Erro: ID do produto inválido ou não fornecido para exclusão.");
      console.error("Tentativa de deletar produto com ID inválido/nulo.");
      return;
    }
    if (!confirm(`Tem certeza que deseja deletar o produto com ID ${id}?`)) {
      return;
    }
    this.produtoService.deletarProduto(id).subscribe({
      next: () => {
        alert(`Produto ID ${id} deletado com sucesso!`);

        // Recarrega a lista de produtos
        this.carregarProdutos();
      },
      error: (err) => {
        console.error('Erro ao deletar produto:', err);
        // Mensagem de erro mais amigável, talvez mostrando o status
        const status = err.status ? ` (Status: ${err.status})` : '';
        alert(`Erro ao deletar produto ID ${id}. Verifique o console. ${status}`);
      }
    });
  }

  public proximaPagina(): void {
    // LÓGICA DE CONTROLE DE PÁGINA:
    const totalPaginas = this.getTotalPaginas();
    if (this.paginaAtual < totalPaginas) {
      this.paginaAtual++;
      this.carregarProdutos();
    }
  }

  public voltarPagina(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.carregarProdutos();
    }
  }
  public getTotalPaginas(): number {
    return Math.ceil(this.totalItens / this.limitePorPagina);
  }

  public pesquisarProduto(): void {
    // O método "onBuscarSugestao" já faz a pesquisa em tempo real, 
    // mas você pode chamar o carregarProdutos aqui se quiser um botão de busca dedicado
    this.onBuscarSugestao();
  }
}