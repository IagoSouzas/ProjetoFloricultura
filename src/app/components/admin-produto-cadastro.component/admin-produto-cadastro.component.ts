import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';

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
  imagem?: string; // nome/path da imagem salva (ex: "123456-orquidea.jpg")
}

@Component({
  selector: 'app-admin-produto-cadastro.component',
  imports: [FormsModule, Header],
  templateUrl: './admin-produto-cadastro.component.html',
  styleUrl: './admin-produto-cadastro.component.css'
})
export class AdminProdutoCadastroComponent implements OnInit {
  public isAlterarMode: boolean = false;
  private produtoId: string | undefined;

  // Arquivo selecionado pelo usuário
  public arquivoSelecionado: File | null = null;
  public nomeImagemParaSalvar: string = '';

  public produto: Produto = {
    nome_produto: '',
    categoria: '',
    especie: '',
    descricao: '',
    cor: '',
    condicoes_cultivo: '',
    qtd_estoque: 0,
    preco: 0.00,
    observacao: '',
    imagem: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.produtoId = idParam || undefined;
    this.isAlterarMode = !!this.produtoId;

    if (this.isAlterarMode) {
      this.carregarProdutoParaEdicao(this.produtoId!);
    }
  }

  carregarProdutoParaEdicao(id: string): void {
    this.produtoService.getProdutoPorId(id).subscribe({
      next: (data) => {
        this.produto = data;
        // Se já tiver imagem salva, pode exibir no futuro
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar produto para alteração.');
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.arquivoSelecionado = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.produto.imagem = reader.result as string; // salva como base64
      };
      reader.readAsDataURL(file); // converte pra base64
    }
  } public onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.produto.nome_produto.trim()) {
      alert("O nome do produto é obrigatório.");
      return;
    }

    // Remove o id se estiver cadastrando
    const payload: any = { ...this.produto };
    delete payload.id;

    if (this.isAlterarMode && this.produtoId) {
      // ALTERAR
      this.produtoService.alterarProduto(this.produtoId, payload).subscribe({
        next: () => {
          alert("Produto alterado com sucesso!");
          this.router.navigate(['admin/consultar']);
        },
        error: (err) => {
          console.error(err);
          alert("Erro ao alterar: " + err.message);
        }
      });
    } else {
      // CADASTRAR
      this.produtoService.cadastrarProduto(payload).subscribe({
        next: () => {
          alert("Produto cadastrado com sucesso!");
          this.router.navigate(['admin/consultar']);
        },
        error: (err) => {
          console.error(err);
          alert("Erro ao cadastrar: " + err.message);
        }
      });
    }
  }
}