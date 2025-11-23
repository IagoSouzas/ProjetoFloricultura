import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interface para padronizar o item no carrinho
export interface ItemCarrinho {
  id: number; // ID do produto original
  url: string;
  nome: string;
  preco: number;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  // BehaviorSubject para gerenciar o estado do carrinho e emitir atualizações
  private itensSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  // Observable público para que outros componentes possam "assinar"
  public itens$ = this.itensSubject.asObservable();

  constructor() {
    // Aqui você pode adicionar lógica para carregar o carrinho do usuário logado
  }

  /**
   * Adiciona um item ao carrinho ou incrementa sua quantidade.
   * @param item O objeto do item vindo do carrosel.
   */
  adicionarItem(item: { id: number, src: string, name: string, price: string }): void {
    const itensAtuais = this.itensSubject.value;

    // Converte o preço de string ("175,00 BRL") para number (175.00)
    const precoLimpo = parseFloat(item.price.replace(' BRL', '').replace(',', '.'));

    const itemExistente = itensAtuais.find(i => i.id === item.id);

    if (itemExistente) {
      // Item já existe: incrementa a quantidade
      itemExistente.quantidade += 1;
    } else {
      // Item novo: cria um novo ItemCarrinho
      const novoItem: ItemCarrinho = {
        id: item.id,
        url: item.src,
        nome: item.name,
        preco: precoLimpo,
        quantidade: 1
      };
      itensAtuais.push(novoItem);
    }

    // Notifica todos os assinantes com a nova lista de itens
    this.itensSubject.next(itensAtuais);
    console.log(`[CarrinhoService] Item adicionado/incrementado: ${item.name}. Total de itens distintos: ${itensAtuais.length}`);

    // TODO: Adicionar aqui a chamada ao UsuarioService para atualizar o campo 'itens_adicionais'
  }

  /**
   * Retorna a lista atual de itens (útil para lógica síncrona, como verificar se está vazio).
   */
  getItens(): ItemCarrinho[] {
    return this.itensSubject.value;
  }
}