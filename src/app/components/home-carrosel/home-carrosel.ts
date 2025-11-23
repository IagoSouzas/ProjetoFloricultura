// home-carrosel.component.ts
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule para *ngFor e *ngIf
import { ProdutoService } from '../../services/produto'; // Importar ProdutoService
import { Produto, CarrinhoItem } from '../../services/interfaces/produto'; // Importar interfaces
import { UsuarioService } from '../../services/usuario-service'; // Importar UsuarioService
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-carrosel',
  standalone: true, // Use 'standalone' ou adicione a declaração no AppModule/importador
  imports: [CommonModule],
  templateUrl: './home-carrosel.html',
  styleUrl: './home-carrosel.css'
})
export class HomeCarroselComponent implements OnInit, AfterViewInit, OnDestroy {
  // Injeção de dependências
  private produtoService = inject(ProdutoService);
  private usuarioService = inject(UsuarioService);
  private renderer = inject(Renderer2);
  private router = inject(Router);

  // Referências aos elementos do DOM
  @ViewChild('carouselTrack') track!: ElementRef<HTMLDivElement>;
  @ViewChild('prevButton') prevButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('nextButton') nextButton!: ElementRef<HTMLButtonElement>;

  // Variáveis de configuração
  readonly visible = 5;
  readonly centerOffset: number; // 2
  readonly cardWidthPercentage: number; // 100 / 5 = 20

  // Substituindo flowerCards pelo tipo Produto[] e inicializando como vazio
  flowerCards: Produto[] = [];

  // Variável que contém os cards originais e os clones para o loop infinito
  cardsWithClones: Produto[] = [];

  centerIndex = 0;
  isTransitioning = false;
  private intervalId: any;
  private resizeListener: (() => void) | null = null;

  constructor() {
    this.centerOffset = Math.floor(this.visible / 2);
    this.cardWidthPercentage = 100 / this.visible;
  }

  ngOnInit(): void {
    this.carregarProdutos(); // Chama a função de busca da API
  }

  /**
   * 1. Busca os produtos na API.
   * 2. Preenche o array `flowerCards`.
   * 3. Cria os clones para o carrossel infinito.
   */
  carregarProdutos(): void {
    this.produtoService.getProdutosAll().subscribe({
      next: (produtos: Produto[]) => {
        this.flowerCards = produtos;
        this.setupClones();
        console.log('Produtos carregados da API:', this.flowerCards.length);
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    });
  }

  /**
   * Adiciona um produto ao carrinho do usuário logado.
   * @param produto O produto a ser adicionado.
   */
  adicionarAoCarrinho(produto: Produto): void {
    const userId = this.usuarioService.getUserId();

    if (!userId) {
      alert('Você precisa estar logado para adicionar itens ao carrinho.');
      this.router.navigate(['/login']); // Redireciona para o login (assumindo que há rota)
      return;
    }

    console.log(`Adicionando produto ID ${produto.id} ao carrinho do usuário ${userId}...`);

    // 1. Buscar o usuário atual para obter a versão mais recente do carrinho
    this.usuarioService.getUsuarioPorId(userId).subscribe({
      next: (usuario) => {
        const carrinho = usuario.itens_adicionais || [];
        const itemId = produto.id;

        // 2. Verificar se o item já existe no carrinho
        const itemExistente = carrinho.find(item => item.id_produto === itemId);

        if (itemExistente) {
          // Se existe, incrementa a quantidade
          itemExistente.quantidade += 1;
          console.log(`Item ID ${itemId} já estava no carrinho. Quantidade atualizada para ${itemExistente.quantidade}.`);
        } else {
          // Se não existe, adiciona como novo item
          const novoItem: CarrinhoItem = {
            id_produto: produto.id!,           // ← non-null assertion (ou use ?? 'temp')
            nome_produto: produto.nome_produto,
            preco_unitario: produto.preco,
            quantidade: 1,
            imagem: produto.imagem ?? undefined,
          };
          carrinho.push(novoItem);
          console.log(`Novo item ID ${itemId} adicionado ao carrinho.`);
        }

        // 3. Atualizar o carrinho no objeto do usuário e enviar para a API
        usuario.itens_adicionais = carrinho;

        this.usuarioService.updateUsuario(usuario).subscribe({
          next: () => {
            alert(`"${produto.nome_produto}" adicionado ao carrinho com sucesso!`);
          },
          error: (error) => {
            console.error('Erro ao atualizar o carrinho:', error);
            alert('Erro ao salvar o item no carrinho. Tente novamente.');
          }
        });
      },
      error: (error) => {
        console.error('Erro ao buscar usuário para atualizar carrinho:', error);
        alert('Não foi possível carregar os dados do seu usuário para atualizar o carrinho.');
      }
    });
  }


  // --- Lógica do Carrossel (mantida) ---

  setupClones(): void {
    if (this.flowerCards.length === 0) {
      this.cardsWithClones = [];
      return;
    }

    // Clona os últimos N cartões para o começo (pre-pend)
    const clonesStart = this.flowerCards.slice(-this.centerOffset);
    // Clona os primeiros N cartões para o final (append)
    const clonesEnd = this.flowerCards.slice(0, this.centerOffset);

    this.cardsWithClones = [...clonesStart, ...this.flowerCards, ...clonesEnd];

    // Inicializa o índice para o primeiro item real (após os clones iniciais)
    this.centerIndex = this.centerOffset;

    // Apenas aplica a transformação inicial se a view já estiver pronta
    if (this.track) {
      this.applyTransform(false);
    }
  }

  ngAfterViewInit(): void {
    // Garante que a posição inicial é aplicada (sem transição)
    this.applyTransform(false);

    // Adiciona listener para transição
    this.renderer.listen(this.track.nativeElement, 'transitionend', this.onTransitionEnd.bind(this));

    // Adiciona listener de resize para re-aplicar o transform (em caso de bugs de layout)
    this.resizeListener = this.renderer.listen('window', 'resize', () => this.applyTransform(true));
  }

  ngOnDestroy(): void {
    // Limpeza de listeners e intervalos
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.resizeListener) {
      this.resizeListener(); // Remove o listener de resize
    }
  }

  /**
   * Move o carrossel na direção indicada (1 para frente, -1 para trás).
   */
  go(direction: 1 | -1): void {
    if (this.isTransitioning || this.flowerCards.length === 0) {
      return;
    }

    this.isTransitioning = true;
    this.centerIndex += direction;
    this.applyTransform(true);
  }

  /**
   * Aplica o CSS transform para mover o carrossel.
   * @param transition Se deve aplicar a transição suave (true) ou teleporte instantâneo (false).
   */
  applyTransform(transition: boolean): void {
    if (!this.track) return;

    const offset = -(this.centerIndex * this.cardWidthPercentage);
    this.renderer.setStyle(this.track.nativeElement, 'transform', `translateX(${offset}%)`);
    this.renderer.setStyle(this.track.nativeElement, 'transition', transition ? 'transform 0.5s ease-out' : 'none');

    // Se estiver aplicando transição, o estado `isTransitioning` será resetado pelo 'transitionend'
    if (!transition) {
      this.isTransitioning = false;
    }
  }

  /**
   * Handler chamado ao final da transição CSS para criar o loop infinito após a transição.
   */
  onTransitionEnd(): void {
    if (this.flowerCards.length === 0) return;

    const total = this.cardsWithClones.length;
    const originalsCount = this.flowerCards.length;

    const firstOriginal = this.centerOffset;
    const lastOriginal = total - this.centerOffset - 1;

    // Caiu nos clones do começo (antes do primeiro original)
    if (this.centerIndex < firstOriginal) {
      // Teleporta para o espelho no final (mantendo o deslocamento)
      const stepsPastFirst = firstOriginal - this.centerIndex; // Quantos passos passou do 1º original
      this.centerIndex = lastOriginal - stepsPastFirst + 1;

      this.applyTransform(false); // Sem transição para o teleporte
      // Força o reflow e volta a transição para próximos movimentos
      setTimeout(() => this.applyTransform(true), 0); // setTimeout(0) é uma alternativa simples ao requestAnimationFrame
    }
    // Caiu nos clones do final (após o último original)
    else if (this.centerIndex > lastOriginal) {
      // Teleporta para o espelho no começo (mantendo o deslocamento)
      const stepsPastLast = this.centerIndex - lastOriginal; // Quantos passos passou do último original
      this.centerIndex = firstOriginal + stepsPastLast - 1;

      this.applyTransform(false); // Sem transição para o teleporte
      // Força o reflow e volta a transição para próximos movimentos
      setTimeout(() => this.applyTransform(true), 0);
    }

    // Garante que o estado 'isTransitioning' é atualizado
    this.isTransitioning = false;
  }
}