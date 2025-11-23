import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importar o ItemComponent e a Interface ItemCarrinho (assumindo que ItemComponent exporta)
import { CestaComponent } from './cesta.component/cesta.component';
import { HeaderComponent } from './header.component/header.component';
import { FooterComponent } from './footer.component/footer.component';
import { ItemComponent, ItemCarrinho } from './item.component/item.component'; // <--- Importação da Interface

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, CestaComponent, HeaderComponent, FooterComponent, ItemComponent],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {
  
  itens: ItemCarrinho[] = [
    // { url: 'assets/imagensProdutos/flores.svg', nome: 'Buquê Romance Eterno', preco: 189.90, quantidade: 1 },
  ];
  
  carrinhoVazio: boolean = this.itens.length === 0; 

}