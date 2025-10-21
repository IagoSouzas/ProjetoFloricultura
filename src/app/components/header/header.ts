import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Input() mostrarNavegacao: boolean = true;
  imagemIcon = 'assets/imagens/iconeconta.png';
  imagemLogo = 'assets/imagens/logoimagem.svg';

  isMenuOpen: boolean = false;
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
