import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-produto-cadastro.component',
  imports: [],
  templateUrl: './admin-produto-cadastro.component.html',
  styleUrl: './admin-produto-cadastro.component.css'
})
export class AdminProdutoCadastroComponent {
  public isAlterarMode: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const lastSegment = this.route.snapshot.url.pop()?.path;

    this.isAlterarMode = lastSegment === 'alterar-produto';
  }

  public onSubmit(event: Event): void {

    event.preventDefault();

    if (this.isAlterarMode) {
      alert("Produto alterado");
    } else {
      alert("Produto cadastrado");
    }
  }
}
