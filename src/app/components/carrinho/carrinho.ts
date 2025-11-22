import { Component } from '@angular/core';
import { CestaComponent } from './cesta.component/cesta.component';
import { HeaderComponent } from './header.component/header.component';
import { FooterComponent } from './footer.component/footer.component';


@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CestaComponent, HeaderComponent,FooterComponent],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {

}
