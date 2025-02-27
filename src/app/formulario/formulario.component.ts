import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContatoService } from '../contato.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <form (ngSubmit)="salvar()" class="formulario">
      <h2>{{ id ? 'Editar' : 'Novo' }} Contato</h2>

      <div class="campo">
        <label>Nome:</label>
        <input [(ngModel)]="contato.nome" name="nome" required>
      </div>

      <div class="campo">
        <label>Email:</label>
        <input type="email" [(ngModel)]="contato.email" name="email" required>
      </div>

      <div class="campo">
        <label>Telefone:</label>
        <input [(ngModel)]="contato.fone" name="fone">
      </div>

      <div class="botoes">
        <button type="button" routerLink="/" class="btn-cancelar">Cancelar</button>
        <button type="submit" class="btn-salvar">Salvar</button>
      </div>
    </form>
  `,
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {
  contato: any = {};
  id?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contatoService: ContatoService
  ) {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.contatoService.getContatoById(this.id).subscribe(contato => {
        this.contato = contato;
      });
    }
  }

  salvar(): void {
    const operacao = this.id
      ? this.contatoService.atualizarContato(this.id, this.contato)
      : this.contatoService.criarContato(this.contato);

    operacao.subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error(err)
    });
  }
}
