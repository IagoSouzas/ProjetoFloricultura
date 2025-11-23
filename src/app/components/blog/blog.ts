import { Component } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'app-blog',
  imports: [Header],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog {
  imagemSakura = 'assets/imagens/sakura.png'
}
