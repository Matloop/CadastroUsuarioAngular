import { Routes } from '@angular/router';
import { ListaContatosComponent } from './lista-contatos/lista-contatos.component';
import { FormularioComponent } from './formulario/formulario.component';

export const routes: Routes = [
  { path: '', component: ListaContatosComponent },
  { path: 'novo', component: FormularioComponent },
  { path: 'editar/:id', component: FormularioComponent }
];
