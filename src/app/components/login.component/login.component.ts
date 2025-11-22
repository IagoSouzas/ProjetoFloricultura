import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router'; 
import { Header } from '../header/header';

@Component({
  selector: 'app-login', 
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, Header], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';

  private readonly validUsers = [
    { username: 'admin@gmail.com', password: 'senha123', role: 'admin' },
    { username: 'usuario@gmail.com', password: 'senha123', role: 'user' }
  ];

  constructor(private router: Router) { }

  
  onLogin(): void {
    this.loginError = '';

    const user = this.validUsers.find(
      u => u.username === this.username && u.password === this.password
    );

    if (user) {
      console.log(`Login bem-sucedido para: ${user.username}`);
      localStorage.setItem('userRole', user.role);

      if (user.role === 'admin') {
        this.router.navigate(['/admin/consultar']); 
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.loginError = 'E-mail/CPF ou senha incorretos.';
    }
  }

  formulario = new FormGroup ({
    username: new FormControl ('', [Validators.required, Validators.email, Validators.nullValidator]),
    password: new FormControl ('', [Validators.required, Validators.nullValidator, Validators.minLength(8)]),

  })

  onSubmit(){
    if (this.formulario.valid) {
      alert('Formulário foi enviado com sucesso!')
    }
  }

}