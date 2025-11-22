import { Component } from '@angular/core';
import { CestaComponent } from './cesta.component/cesta.component';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CestaComponent],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {

}
