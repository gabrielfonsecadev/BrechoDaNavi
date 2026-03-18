import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product, ProductPayload } from '../product-admin.service';

@Component({
    selector: 'app-product-form-dialog',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        MatDialogModule, MatFormFieldModule, MatInputModule,
        MatButtonModule, MatIconModule
    ],
    templateUrl: './product-form-dialog.component.html',
    styleUrl: './product-form-dialog.component.scss'
})
export class ProductFormDialogComponent {
    form: FormGroup;
    isEdit: boolean;
    selectedFiles: File[] = [];
    existingImages: string[] = [];
    imagesToDelete: string[] = [];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ProductFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Product | null
    ) {
        this.isEdit = data !== null;
        this.form = this.fb.group({
            name: [data?.name ?? '', [Validators.required, Validators.maxLength(200)]],
            description: [data?.description ?? '', Validators.maxLength(1000)],
            price: [data?.price ?? null, [Validators.required, Validators.min(0.01)]]
        });
        if (data?.images) {
            this.existingImages = [...data.images];
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            const newFiles = Array.from(input.files);
            // Acumular arquivos em vez de substituir
            this.selectedFiles = [...this.selectedFiles, ...newFiles];
            // Limpar valor do input para permitir selecionar o mesmo arquivo novamente se desejar
            input.value = '';
        }
    }

    removeFile(index: number): void {
        this.selectedFiles.splice(index, 1);
    }

    removeExistingImage(url: string): void {
        // Extrair ID da URL (última parte da rota/products/images/{id})
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        if (id) {
            this.imagesToDelete.push(id);
            this.existingImages = this.existingImages.filter(img => img !== url);
        }
    }

    salvar(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        const payload: ProductPayload = {
            name: this.form.value.name.trim(),
            description: this.form.value.description.trim(),
            price: Number(this.form.value.price)
        };
        this.dialogRef.close({
            payload,
            files: this.selectedFiles,
            imagesToDelete: this.imagesToDelete
        });
    }

    cancelar(): void {
        this.dialogRef.close();
    }
}
