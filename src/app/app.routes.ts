import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Blog } from './components/blog/blog';
import { AdminProdutoComponent } from './components/admin-produto.component/admin-produto.component';
import { AdminProdutoCadastroComponent } from './components/admin-produto-cadastro.component/admin-produto-cadastro.component';
import { LoginComponent } from './components/login.component/login.component';
import { LoginCadastroComponent } from './components/login-cadastro.component/login-cadastro.component';
import { Carrinho } from './components/carrinho/carrinho';
import { ItemComponent } from './components/carrinho/item.component/item.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'blog', component: Blog },
    { path: 'admin/consultar', component: AdminProdutoComponent },
    { path: 'admin/cadastrar-produto', component: AdminProdutoCadastroComponent },
    { path: 'admin/alterar-produto/:id', component: AdminProdutoCadastroComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro-login', component: LoginCadastroComponent },
    { path: 'carrinho', component: Carrinho },
    { path: 'carrinho/item', component: ItemComponent },


];