import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService, Produto } from '../services/cart.service';
import { API_URL } from '../../enviroment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Produto | null = null;
  loading = true;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.http.get<Produto>(`${API_URL}/products/${id}`).subscribe({
      next: (data) => {
        this.product = data;
        this.selectedImage = data.images[0];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produto', err);
        this.loading = false;
      }
    });
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  adicionarAoCarrinho(): void {
    if (this.product) {
      this.cartService.adicionarAoCarrinho(this.product);
    }
  }

  buyViaWhatsApp(): void {
    if (!this.product) return;
    const numeroWhatsApp = '5511999999999'; // Substitua pelo número real da loja
    const mensagem = `Olá! Tenho interesse no produto: ${this.product.name} (R$ ${this.product.price.toFixed(2)}).`;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }
}
