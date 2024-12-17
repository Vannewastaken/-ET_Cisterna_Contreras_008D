import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarEventosPage } from './gestionar-eventos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarEventosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarEventosPageRoutingModule {}
