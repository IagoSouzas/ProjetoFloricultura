import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { UsuarioService } from '../../../services/usuario-service';
import { Router } from '@angular/router';

export interface ItemCarrinho {
  url: string;
  nome: string;
  preco: number;
  quantidade: number;
  id_produto: string;
}

@Component({
  selector: 'app-item-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  private router = inject(Router)
  cestaCheia = 'assets/imagens/cesta_cheia.svg';

  // AGORA ACEITA UM ARRAY DE ITENS
  @Input() itens: ItemCarrinho[] = [];

  constructor(private usuarioService: UsuarioService) { }

  aumentarQuantidade(item: ItemCarrinho): void {
    this.usuarioService.adicionarItemAoCarrinho({
      id: item.id_produto,
      nome_produto: item.nome,
      preco: item.preco,
    } as any).subscribe({
      next: () => item.quantidade += 1,
      error: () => alert('Erro ao adicionar')
    });
  }

  diminuirQuantidade(item: ItemCarrinho): void {
    if (item.quantidade <= 1) {
      if (confirm('Remover item?')) {
        this.removerItem(item);
      }
      return;
    }
    this.usuarioService.removerItemDoCarrinho(item.id_produto).subscribe({
      next: () => item.quantidade -= 1,
      error: () => alert('Erro ao diminuir')
    });
  }

  removerItem(item: ItemCarrinho): void {
    this.usuarioService.removerItemDoCarrinho(item.id_produto).subscribe({
      next: () => {
        const index = this.itens.indexOf(item);
        if (index > -1) this.itens.splice(index, 1);
      },
      error: () => alert('Erro ao remover')
    });
  }

  get totalItens(): number {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }

  get valorTotal(): number {
    return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

  continuarCompra(): void {
    this.router.navigate(['/']); // ou ['/home'] se preferir
  }

  finalizarCompra(): void {
    // Futuramente vai pra tela de pagamento
    alert('Funcionalidade de Finalizar Compra em desenvolvimento!');
    // this.router.navigate(['/checkout']);
  }

}