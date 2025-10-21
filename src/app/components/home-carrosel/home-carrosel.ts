// home-carrosel.component.ts
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule para *ngFor e *ngIf

@Component({
  selector: 'app-home-carrosel',
  standalone: true, // Use 'standalone' ou adicione a declaração no AppModule/importador
  imports: [CommonModule],
  templateUrl: './home-carrosel.html',
  styleUrl: './home-carrosel.css'
})
export class HomeCarroselComponent implements OnInit, AfterViewInit, OnDestroy {
  // Referências aos elementos do DOM
  @ViewChild('carouselTrack') track!: ElementRef<HTMLDivElement>;
  @ViewChild('prevButton') prevButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('nextButton') nextButton!: ElementRef<HTMLButtonElement>;

  // Variáveis de configuração
  readonly visible = 5;
  readonly centerOffset: number; // 2
  readonly cardWidthPercentage: number; // 100 / 5 = 20

  // Dados dos cards (simplificado, mas você usaria um serviço real)
  flowerCards = [
    { src: "https://static.giulianaflores.com.br/images/product/32081gg.jpg?ims=600x600", alt: "Buquê de Girassol", name: "Buquê de Girassol", price: "175,00 BRL" },
    { src: "https://veiling.com.br/wp-content/uploads/2025/06/cris-mini-br-683e69b760e77.jpeg", alt: "Kiku (Crisântemo)", name: "Kiku (Crisântemo)", price: "175,00 BRL" },
    { src: "https://static.giulianaflores.com.br/images/product/33018gg3.jpg?ims=600x600", alt: "Buquê de Rosas", name: "Buquê de Rosas", price: "175,00 BRL" },
    { src: "https://www.ecompletocdn.com.br/i/fp/1606/604773_2_1449693447.jpg", alt: "Buquê de Gerbera", name: "Buquê de Gerbera", price: "175,00 BRL" },
    { src: "https://static.giulianaflores.com.br/images/product/rs-19017-56296-0.jpg?ims=405x405", alt: "Hortênsias", name: "Hortênsias", price: "175,00 BRL" },
  ];

  // Array que será usado no template (originais + clones)
  cardsWithClones: any[] = [];

  // Estado do carrossel
  centerIndex: number = 0;
  isTransitioning: boolean = false;

  constructor(private renderer: Renderer2) {
    this.centerOffset = Math.floor(this.visible / 2);
    this.cardWidthPercentage = 100 / this.visible;
  }

  ngOnInit(): void {
    // === 1) Clona as pontas (Lógica para loop infinito) ===
    const originals = this.flowerCards;
    const headClones = originals.slice(-this.centerOffset);
    const tailClones = originals.slice(0, this.centerOffset);

    // Cria a lista com Clones: [clones da cauda] + [originais] + [clones da cabeça]
    this.cardsWithClones = [...headClones, ...originals, ...tailClones];

    // O índice inicial deve compensar os clones da cabeça
    this.centerIndex = this.centerOffset;
  }

  ngAfterViewInit(): void {
    // Aplica a transformação inicial após a renderização dos clones
    this.applyTransform(false);
    this.updateActive();

    // Adiciona o listener para `transitionend`
    // Usamos o Renderer2 para manipular eventos fora do fluxo de templates
    this.renderer.listen(this.track.nativeElement, 'transitionend', () => this.onTransitionEnd());
  }

  ngOnDestroy(): void {
    // Não é estritamente necessário para um listener via Renderer2, mas boa prática
    // se o listener fosse guardado em uma variável.
  }

  // --- Funções de controle de CSS/Estado ---

  /**
   * Aplica a translação no track do carrossel.
   * @param withTransition Se deve aplicar a transição CSS.
   */
  private applyTransform(withTransition: boolean): void {
    const trackElement = this.track.nativeElement;
    const offset = -(this.centerIndex - this.centerOffset) * this.cardWidthPercentage;

    this.renderer.setStyle(trackElement, 'transform', `translateX(${offset}%)`);
    this.isTransitioning = withTransition;
    this.renderer.setStyle(trackElement, 'transition', withTransition ? 'transform 0.4s ease-in-out' : 'none');
  }

  /**
   * Atualiza a classe 'active' no elemento central.
   */
  private updateActive(): void {
    // O Angular gerencia a lista 'cardsWithClones', então precisamos do elemento DOM
    // do card central, ou fazer o controle via índice no template.
    // Vamos usar a manipulação de DOM para ser fiel à lógica original.
    const cards = Array.from(this.track.nativeElement.children);

    cards.forEach(c => this.renderer.removeClass(c, 'active'));
    if (cards[this.centerIndex]) {
      this.renderer.addClass(cards[this.centerIndex], 'active');
    }
  }

  // --- Navegação e Teleporte ---

  /**
   * Move o carrossel na direção especificada.
   * @param dir -1 para anterior, +1 para próximo.
   */
  go(dir: number): void {
    this.centerIndex += dir;
    this.applyTransform(true); // Sempre com transição ao navegar
    this.updateActive();
  }

  /**
   * Gerencia o teleporte para o loop infinito após a transição.
   */
  onTransitionEnd(): void {
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