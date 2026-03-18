import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Produto } from '../services/cart.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent {
  @Output() close = new EventEmitter<void>();

  constructor(public cartService: CartService) { }

  get carrinho(): Produto[] {
    return this.cartService.carrinho;
  }

  get total(): number {
    return this.cartService.total;
  }

  removerItem(index: number): void {
    this.cartService.removerDoCarrinho(index);
  }

  finalizarCompra(): void {
    if (this.carrinho.length === 0) return;

    const numeroWhatsApp = '5531995295031'; // Substitua pelo número real da loja
    const itens = this.carrinho.map(p => `${p.name} - R$ ${p.price.toFixed(2)}`).join(', ');
    const mensagem = `Olá! Gostaria de comprar os seguintes itens: ${itens}. Total: R$ ${this.total.toFixed(2)}`;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank');
  }
}
