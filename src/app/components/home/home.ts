import { Component } from '@angular/core';
import { HomeCarroselComponent } from '../home-carrosel/home-carrosel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeCarroselComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  imagemBonsai = "assets/imagens/bonsai.png"


  
}
