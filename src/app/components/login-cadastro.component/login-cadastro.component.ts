import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-cadastro.component',
  imports: [],
  templateUrl: './login-cadastro.component.html',
  styleUrl: './login-cadastro.component.css'
})
export class LoginCadastroComponent {
  constructor(private router: Router) { }


  onFinalizarCadastro(): void {
    alert('Cadastro enviado com sucesso! Em breve, você receberá a confirmação.');

    this.router.navigate(['/']);

  }
}
