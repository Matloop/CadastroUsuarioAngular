import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2>Confirmar Exclusão</h2>
    <p>Tem certeza que deseja excluir este contato?</p>
    <div class="botoes">
      <button (click)="recusar()">Cancelar</button>
      <button (click)="confirmar()" class="excluir">Excluir</button>
    </div>
  `,
  styles: [`
    .botoes { display: flex; gap: 10px; margin-top: 20px; }
    .excluir { background-color: #ff4444; color: white; }
  `]
})
export class ConfirmarExclusaoComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmarExclusaoComponent>) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }

  recusar(): void {
    this.dialogRef.close(false);
  }
}
