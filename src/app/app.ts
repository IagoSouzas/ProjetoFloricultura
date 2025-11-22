import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Header } from './components/header/header';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('trabalhoFloricultura');
  public showNav: boolean = true;

  private readonly rotasProibidas = ['/admin', '/login','/admin/consultar','/admin/cadastrar-produto','/admin/alterar-produto','/cadastro-login','/carrinho'];

  constructor(private router: Router) {
    this.updateNavVisibility(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateNavVisibility(event.urlAfterRedirects);
    });
  }

  private updateNavVisibility(currentUrl: string): void {
    let path = currentUrl.split('?')[0].split('#')[0];

    const isForbidden = this.rotasProibidas.includes(path);

    this.showNav = !isForbidden;
  }
}
