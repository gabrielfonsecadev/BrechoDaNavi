import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        MatCardModule, MatFormFieldModule, MatInputModule,
        MatButtonModule, MatIconModule, MatSnackBarModule
    ],
    templateUrl: './admin-login.component.html',
    styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
    apiKey = '';
    hideKey = true;

    constructor(private router: Router, private snackBar: MatSnackBar) {
        // Se já tem chave salva, redireciona direto
        if (localStorage.getItem('brecho_api_key')) {
            this.router.navigate(['/admin/dashboard']);
        }
    }

    entrar(): void {
        if (!this.apiKey.trim()) {
            this.snackBar.open('Informe a API Key.', 'Fechar', { duration: 3000 });
            return;
        }
        localStorage.setItem('brecho_api_key', this.apiKey.trim());
        this.router.navigate(['/admin/dashboard']);
    }
}
