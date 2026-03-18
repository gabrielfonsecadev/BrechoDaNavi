import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="confirm-title">
      <mat-icon>warning</mat-icon>
      Confirmar exclusão
    </h2>
    <mat-dialog-content class="confirm-content">
      <p>Tem certeza que deseja excluir <strong>{{ data }}</strong>?<br>
      Esta ação não pode ser desfeita.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="confirm-actions">
      <button mat-button (click)="fechar(false)" id="btn-cancelar-confirm">Cancelar</button>
      <button mat-flat-button class="btn-excluir" (click)="fechar(true)" id="btn-confirmar-excluir">
        <mat-icon>delete</mat-icon> Excluir
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; }
    .confirm-title {
      display: flex !important;
      align-items: center;
      gap: 0.5rem;
      color: #222222ff !important;
      font-weight: 700 !important;
      padding: 1.25rem 1.5rem 0 !important;
      mat-icon { color: #f59e0b; }
    }
    .confirm-content {
      padding: 1rem 1.5rem !important;
      color: #222222ff !important;
      strong { color: rgba(7, 7, 7, 1)222ff; }
    }
    .confirm-actions {
      padding: 1rem 1.5rem !important;
      gap: 0.5rem;
      button[mat-button] { color: rgba(37, 37, 37, 1); }
      .btn-excluir {
        background: #e94560 !important;
        color: #fff !important;
        border-radius: 10px !important;
        font-weight: 600;
        gap: 0.25rem;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  fechar(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}
