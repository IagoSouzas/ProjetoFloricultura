import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-carrinho',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  imagens = [
    { url: "assets/imagens/Mastercard_logo.svg", alt: 'Mastercard_logo' },
    { url: "assets/imagens/Nubank.svg", alt: 'Mastercard_logo' },
    { url: "assets/imagens/pix.svg", alt: 'Mastercard_logo' },
    { url: "assets/imagens/mercado_pago.svg", alt: 'Mastercard_logo' },
    { url: "assets/imagens/visa.svg", alt: 'Mastercard_logo' },
  ];

  imageAtendente = "assets/imagens/atendente.svg"
}
