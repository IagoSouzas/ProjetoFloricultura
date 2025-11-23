import { Component } from '@angular/core';
import { HomeCarroselComponent } from '../home-carrosel/home-carrosel';
import { Header } from '../header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeCarroselComponent, Header],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  imagemBonsai = "assets/imagens/bonsai.png"


  
}
