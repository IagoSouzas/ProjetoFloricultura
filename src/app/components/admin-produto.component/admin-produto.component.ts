import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa diretivas comuns (como *ngFor)
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-produto.component',
  imports: [CommonModule, FormsModule],
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

  // Dados da tabela
  public items = [
    { cod: "001", nome: "Nome do Produto 1", categoria: "Categoria A", estoque: 10 },
    { cod: "002", nome: "Nome do Produto 2", categoria: "Categoria B", estoque: 25 },
    { cod: "003", nome: "Nome do Produto 3", categoria: "Categoria A", estoque: 5 },
    { cod: "004", nome: "Nome do Produto 4", categoria: "Categoria C", estoque: 50 }
  ];
  public paginaAtual: number = 1;


  constructor(private router: Router) { }
  ngOnInit(): void {
  }

  public adicionarNovoProduto(): void {
    this.router.navigate(['admin/cadastrar-produto']);
  }

  public editarProduto(item: any): void {
    this.router.navigate(['admin/alterar-produto']);
  }

  public deletarProduto(item: any): void {
    alert('Deletar produto:' + item.cod);
  }

  public proximaPagina(): void {
    this.paginaAtual++;
  }

  public voltarPagina(): void {
    this.paginaAtual--;
  }

  public pesquisarProduto(): void {
    alert("Procurar produto");
  }
}
