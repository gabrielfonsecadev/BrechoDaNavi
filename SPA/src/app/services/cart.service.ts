import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

export interface Produto {
  id: string;
  name: string;
  images: string[];
  price: number;
  description?: string;
  isSold?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carrinhoSubject = new BehaviorSubject<Produto[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor(private snackBar: MatSnackBar) { }

  get carrinho(): Produto[] {
    return this.carrinhoSubject.value;
  }

  adicionarAoCarrinho(produto: Produto): void {
    if (this.estaNoCarrinho(produto.id)) {
      this.snackBar.open(`${produto.name} já está na sua sacola!`, 'Fechar', { duration: 2000 });
      return;
    }

    const atual = this.carrinhoSubject.value;
    this.carrinhoSubject.next([...atual, produto]);

    this.snackBar.open(`${produto.name} adicionado à sacola!`, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success']
    });
  }

  estaNoCarrinho(id: string): boolean {
    return this.carrinhoSubject.value.some(p => p.id === id);
  }

  removerDoCarrinho(index: number): void {
    const atual = [...this.carrinhoSubject.value];
    atual.splice(index, 1);
    this.carrinhoSubject.next(atual);
  }

  get total(): number {
    return this.carrinho.reduce((acc, p) => acc + p.price, 0);
  }

  limparCarrinho(): void {
    this.carrinhoSubject.next([]);
  }
}
