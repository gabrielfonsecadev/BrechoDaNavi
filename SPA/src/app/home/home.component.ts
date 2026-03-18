import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService, Produto } from '../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  produtos: Produto[] = [];

  constructor(private http: HttpClient, private cartService: CartService) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.http.get<Produto[]>('http://localhost:5000/products').subscribe({
      next: (data) => this.produtos = data,
      error: (err) => console.error('Erro ao carregar produtos', err)
    });
  }

  adicionarAoCarrinho(produto: Produto) {
    this.cartService.adicionarAoCarrinho(produto);
  }

  estaNoCarrinho(id: string): boolean {
    return this.cartService.estaNoCarrinho(id);
  }
}
