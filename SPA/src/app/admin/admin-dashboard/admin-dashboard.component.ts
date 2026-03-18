import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ProductAdminService, Product, ProductPayload } from '../product-admin.service';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        MatTableModule, MatButtonModule, MatIconModule,
        MatDialogModule, MatFormFieldModule, MatInputModule,
        MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule,
        MatChipsModule, MatCardModule, MatDividerModule,
        RouterModule
    ],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
    products = signal<Product[]>([]);
    loading = signal(false);
    displayedColumns = ['name', 'price', 'images', 'createdAt', 'actions'];

    constructor(
        private svc: ProductAdminService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading.set(true);
        this.svc.getAll().subscribe({
            next: (data) => { this.products.set(data); this.loading.set(false); },
            error: () => { this.snackBar.open('Erro ao carregar produtos.', 'Fechar', { duration: 3000 }); this.loading.set(false); }
        });
    }

    openCreate(): void {
        const ref = this.dialog.open(ProductFormDialogComponent, {
            width: '540px',
            data: null,
            panelClass: 'admin-dialog'
        });
        ref.afterClosed().subscribe((result: { payload: ProductPayload, files: File[] } | undefined) => {
            if (result) {
                this.loading.set(true);
                this.svc.create(result.payload).subscribe({
                    next: (newProduct) => {
                        this.snackBar.open('Produto criado!', 'Fechar', { duration: 3000 });
                        if (result.files.length > 0) {
                            this.uploadFiles(newProduct.id, result.files);
                        } else {
                            this.loadProducts();
                        }
                    },
                    error: (err) => { this.handleError(err); this.loading.set(false); }
                });
            }
        });
    }

    openEdit(product: Product): void {
        const ref = this.dialog.open(ProductFormDialogComponent, {
            width: '540px',
            data: product,
            panelClass: 'admin-dialog'
        });
        ref.afterClosed().subscribe((result: { payload: ProductPayload, files: File[], imagesToDelete?: string[] } | undefined) => {
            if (result) {
                this.loading.set(true);
                this.svc.update(product.id, result.payload).subscribe({
                    next: () => {
                        this.snackBar.open('Produto atualizado!', 'Fechar', { duration: 3000 });

                        // Primeiro deleta as imagens marcadas, depois sobe as novas
                        if (result.imagesToDelete && result.imagesToDelete.length > 0) {
                            this.deleteImages(product.id, result.imagesToDelete, () => {
                                if (result.files.length > 0) {
                                    this.uploadFiles(product.id, result.files);
                                } else {
                                    this.loadProducts();
                                }
                            });
                        } else if (result.files.length > 0) {
                            this.uploadFiles(product.id, result.files);
                        } else {
                            this.loadProducts();
                        }
                    },
                    error: (err) => { this.handleError(err); this.loading.set(false); }
                });
            }
        });
    }

    private deleteImages(productId: string, imageIds: string[], onComplete: () => void, index = 0): void {
        if (index >= imageIds.length) {
            onComplete();
            return;
        }

        this.svc.deleteImage(productId, imageIds[index]).subscribe({
            next: () => this.deleteImages(productId, imageIds, onComplete, index + 1),
            error: () => {
                // Mesmo com erro tenta deletar as próximas
                this.deleteImages(productId, imageIds, onComplete, index + 1);
            }
        });
    }

    private uploadFiles(productId: string, files: File[], index = 0): void {
        if (index >= files.length) {
            this.snackBar.open('Imagens enviadas com sucesso!', 'Fechar', { duration: 3000 });
            this.loadProducts();
            return;
        }

        this.svc.uploadImage(productId, files[index]).subscribe({
            next: () => this.uploadFiles(productId, files, index + 1),
            error: (err) => {
                this.snackBar.open(`Erro ao enviar imagem ${index + 1}.`, 'Fechar', { duration: 3000 });
                this.loadProducts();
            }
        });
    }

    confirmDelete(product: Product): void {
        const ref = this.dialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: product.name,
            panelClass: 'admin-dialog'
        });
        ref.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.svc.delete(product.id).subscribe({
                    next: () => { this.snackBar.open('Produto removido!', 'Fechar', { duration: 3000 }); this.loadProducts(); },
                    error: (err) => this.handleError(err)
                });
            }
        });
    }


    sair(): void {
        localStorage.removeItem('brecho_api_key');
        this.router.navigate(['/admin']);
    }

    private handleError(err: any): void {
        const msg = err.status === 401
            ? 'API Key inválida ou ausente.'
            : 'Ocorreu um erro. Tente novamente.';
        this.snackBar.open(msg, 'Fechar', { duration: 4000 });
    }
}
