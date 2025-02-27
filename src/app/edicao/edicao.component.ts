// edicao.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContatoService } from '../contato.service';

@Component({
  selector: 'app-edicao',
  templateUrl: './edicao.component.html',
  styleUrls: ['./edicao.component.css']
})
export class EdicaoComponent implements OnInit {
  contato: any = {};

  constructor(
    private route: ActivatedRoute,
    private service: ContatoService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getContatoById(id).subscribe({
        next: (contato: any) => this.contato = contato,
        error: (err: any) => console.error(err)
      });
    }
  }

  salvar(): void {
    if (this.contato.id) {
      this.service.atualizarContato(this.contato.id, this.contato).subscribe({
        next: () => alert('Contato atualizado!'),
        error: (err: any) => console.error(err)
      });
    }
  }
}
