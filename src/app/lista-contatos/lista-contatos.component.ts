import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContatoService, Contato, PaginatedResponse } from '../contato.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ConfirmarExclusaoComponent } from '../confirmar-exclusao/confirmar-exclusao.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MatPaginatorModule],
  template: `
    <h1>Contatos</h1>
    <button routerLink="/novo" class="btn-novo">Novo Contato</button>

    <div *ngIf="contatosData">
      <div class="contato" *ngFor="let contato of contatosData.items">
        <div class="info">
          <h3>{{ contato.nome }}</h3>
          <p>{{ contato.email }}</p>
          <p>{{ contato.fone }}</p>
        </div>
        <div class="acoes">
          <button [routerLink]="['/editar', contato.id]" class="btn-editar">✏️ Editar</button>
          <button (click)="abrirDialogoExclusao(contato.id)" class="btn-excluir">🗑️ Excluir</button>
        </div>
      </div>

      <!-- Opção 1: Paginador Material -->
      <mat-paginator
        [length]="contatosData.total"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 50]"
        [pageIndex]="currentPage - 1"
        (page)="mudarPagina($event)"
        aria-label="Selecionar página">
      </mat-paginator>

      <!-- Opção 2: Paginador Personalizado -->
      <div class="paginacao">
        <button
          (click)="irParaPagina(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="btn-pagina">
          Anterior
        </button>

        <div class="paginas-numeros">
          <button
            *ngFor="let pagina of getPaginasArray()"
            (click)="irParaPagina(pagina)"
            [class.pagina-ativa]="pagina === currentPage"
            class="btn-numero-pagina">
            {{ pagina }}
          </button>
        </div>

        <button
          (click)="irParaPagina(currentPage + 1)"
          [disabled]="currentPage === contatosData.totalPages || contatosData.totalPages === 0"
          class="btn-pagina">
          Próxima
        </button>
      </div>
    </div>

    <div *ngIf="!contatosData || contatosData.items.length === 0" class="sem-contatos">
      <p>Nenhum contato encontrado.</p>
    </div>
  `,
  styleUrls: ['./lista-contatos.component.css']
})
export class ListaContatosComponent implements OnInit {
  contatosData: PaginatedResponse<Contato> | null = null;
  currentPage = 1;
  pageSize = 5;

  constructor(
    private contatoService: ContatoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarContatos();
  }

  carregarContatos(): void {
    this.contatoService.getContatos(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        // Ajusta a página atual se necessário
        if (data.totalPages > 0 && this.currentPage > data.totalPages) {
          this.currentPage = data.totalPages;
          this.carregarContatos(); // Recarrega com a página ajustada
          return;
        }

        this.contatosData = data;

        // Ajuste adicional para quando não houver contatos
        if (data.total === 0) {
          this.currentPage = 1;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar contatos:', err);
      }
    });
  }

  mudarPagina(event: PageEvent): void {
    console.log('Evento de paginação:', event);
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.carregarContatos();
  }

  irParaPagina(pagina: number): void {
    if (pagina < 1 || (this.contatosData && pagina > this.contatosData.totalPages)) {
      return;
    }

    // Força a detecção de mudanças
    this.currentPage = pagina;

    // Recarrega os dados
    this.carregarContatos();

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Método para gerar array com os números das páginas a serem exibidas
  getPaginasArray(): number[] {
    if (!this.contatosData) return [];

    const totalPages = this.contatosData.totalPages;
    if (totalPages <= 5) {
      // Se tivermos 5 ou menos páginas, exibe todas
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Se tivermos mais de 5 páginas, mostra a atual e até 2 antes e depois
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    // Ajusta o início se estamos perto do final
    if (end === totalPages) {
      start = Math.max(1, end - 4);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  abrirDialogoExclusao(id: string | undefined): void {
    if (!id) return;

    const dialogRef = this.dialog.open(ConfirmarExclusaoComponent);
    dialogRef.afterClosed().subscribe(confirmou => {
      if (confirmou) {
        this.contatoService.deletarContato(id).subscribe({
          next: () => {
            // Verifica se precisa ajustar a página após exclusão
            if (this.contatosData && this.contatosData.items.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            }
            this.carregarContatos();
          }
        });
      }
    });
  }
}
