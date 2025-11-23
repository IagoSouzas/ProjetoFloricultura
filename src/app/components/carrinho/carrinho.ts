import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CestaComponent } from './cesta.component/cesta.component';
import { HeaderComponent } from './header.component/header.component';
import { FooterComponent } from './footer.component/footer.component';
import { ItemComponent, ItemCarrinho } from './item.component/item.component';

// Importe os serviços e interface corretos
import { UsuarioService } from '../../services/usuario-service';
import { CarrinhoItem } from '../../services/interfaces/produto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [
    CommonModule,
    CestaComponent,
    HeaderComponent,
    FooterComponent,
    ItemComponent
  ],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho implements OnInit, OnDestroy {
  itens: ItemCarrinho[] = [];           // ← será preenchido com dados reais
  carrinhoVazio: boolean = true;
  private subscription!: Subscription;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarCarrinho();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private carregarCarrinho(): void {
    const userId = this.usuarioService.getUserId();

    if (!userId) {
      console.log('Usuário não está logado → carrinho vazio');
      this.itens = [];
      this.carrinhoVazio = true;
      return;
    }

    console.log('Carregando carrinho do usuário:', userId);

    this.subscription = this.usuarioService.getUsuarioCarrinho(userId).subscribe({
      next: (carrinhoBackend: CarrinhoItem[]) => {
        this.itens = carrinhoBackend.map(item => ({
          url: item.imagem || 'assets/imagensProdutos/flores.svg', // fallback
          nome: item.nome_produto,
          preco: item.preco_unitario,
          quantidade: item.quantidade,
          id_produto: item.id_produto
        }));

        this.carrinhoVazio = this.itens.length === 0;
        console.log('Carrinho carregado:', this.itens);
      },
      error: (err) => {
        console.error('Erro ao carregar carrinho:', err);
        alert('Erro ao carregar o carrinho. Verifique o console.');
        this.itens = [];
        this.carrinhoVazio = true;
      }
    });
  }

  recarregarCarrinho(): void {
    this.carregarCarrinho();
  }


}