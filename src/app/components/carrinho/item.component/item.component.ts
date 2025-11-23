import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core'; // <-- 1. Importar Input

// 2. Definir a estrutura de um item para tipagem
export interface ItemCarrinho {
    url: string;
    nome: string;
    preco: number;
    quantidade: number;
}

@Component({
  selector: 'app-item-carrinho',
  standalone: true, // Adicionar standalone: true
  imports: [CommonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  cestaCheia = 'assets/imagens/cesta_cheia.svg';
  
  // 3. Receber a lista de itens tipada via @Input()
  @Input() itens: ItemCarrinho[] = []; 
  
  // O array local 'itens = []' foi removido, pois os dados vêm do componente pai.
}