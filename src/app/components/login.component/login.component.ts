import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-login', 
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
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
}