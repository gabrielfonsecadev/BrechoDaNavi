import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { filter } from 'rxjs/operators';
import { CartService, Produto } from './services/cart.service';

interface Mensagem {
  texto: string;
  tipo: 'user' | 'bot';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, CarrinhoComponent, MatSnackBarModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  carrinho: Produto[] = [];
  carrinhoAberto = false;
  isAdminRoute = false;
  isHeaderVisible = true;
  private lastScrollTop = 0;

  constructor(private router: Router, private cartService: CartService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
    });
  }

  ngOnInit() {
    // Subscreve ao carrinho do serviço para manter a sincronia local
    this.cartService.carrinho$.subscribe(c => this.carrinho = c);
  }

  toggleCarrinho() {
    this.carrinhoAberto = !this.carrinhoAberto;
  }

  get total(): number {
    return this.cartService.total;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    // Mostra o header se estiver no topo ou scrollando para cima
    if (st <= 0) {
      this.isHeaderVisible = true;
    } else if (st > this.lastScrollTop && st > 80) {
      // Scroll para baixo e já passou a altura do header
      this.isHeaderVisible = false;
    } else if (st < this.lastScrollTop) {
      // Scroll para cima
      this.isHeaderVisible = true;
    }

    this.lastScrollTop = st <= 0 ? 0 : st;
  }
}
