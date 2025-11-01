import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { FormsModule } from '@angular/forms';

interface Produto {
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
  adicionar_imagem?: File;
}


@Component({
  selector: 'app-admin-produto-cadastro.component',
  imports: [FormsModule],
  templateUrl: './admin-produto-cadastro.component.html',
  styleUrl: './admin-produto-cadastro.component.css'
})
export class AdminProdutoCadastroComponent implements OnInit {
  public isAlterarMode: boolean = false;

  private produtoId: number | undefined;

  public produto: Produto = {
    nome_produto: '',
    categoria: '',
    especie: '',
    descricao: '',
    cor: '',
    condicoes_cultivo: '',
    qtd_estoque: 0,
    preco: 0.00,
    observacao: ''
  };

  constructor(private route: ActivatedRoute, private produtoService: ProdutoService) { }

  ngOnInit(): void {
    // 1. Tenta obter o ID do parâmetro 'id'
    const idParam = this.route.snapshot.paramMap.get('id');
    this.produtoId = idParam ? +idParam : undefined;

    // 2. O MODO ALTERAÇÃO É DETERMINADO PELA EXISTÊNCIA DO ID
    // Se produtoId for um número, estamos no modo de alteração
    this.isAlterarMode = !!this.produtoId;

    if (this.isAlterarMode) {
      // Se o ID existir e for um número válido, carrega o produto
      this.carregarProdutoParaEdicao(this.produtoId!);
    }
  }

  // Método para carregar os dados do produto para preencher o formulário
  carregarProdutoParaEdicao(id: number): void {
    this.produtoService.getProdutoPorId(id).subscribe({
      next: (data) => {
        this.produto = data; // Preenche o modelo do formulário com os dados da API
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar produto para alteração.');
      }
    });
  }

  public onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.produto.nome_produto) {
      alert("O nome do produto é obrigatório.");
      return;
    }

    // **NOTA:** Para o json-server, a imagem (input type="file") não será enviada
    // facilmente como parte do JSON. Apenas envie os campos de texto/número.
    const produtoPayload = { ...this.produto };
    delete produtoPayload.id; // Garante que o ID não vá no POST
    // delete produtoPayload.adicionar_imagem; // Se tivesse no modelo

    if (this.isAlterarMode && this.produtoId) {
      // Modo Alterar (PUT)
      this.produtoService.alterarProduto(this.produtoId, produtoPayload).subscribe({
        next: () => {
          alert("Produto alterado com sucesso!");
          // Aqui você redirecionaria para a lista de produtos
        },
        error: (error) => {
          console.error('Erro na alteração:', error);
          alert("Erro ao alterar o produto.");
        }
      });

    } else {
      // Modo Cadastro (POST)
      this.produtoService.cadastrarProduto(produtoPayload).subscribe({
        next: () => {
          alert("Produto cadastrado com sucesso!");
          // Aqui você resetaria o formulário ou redirecionaria
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          alert("Erro ao cadastrar o produto.");
        }
      });
    }
  }
}