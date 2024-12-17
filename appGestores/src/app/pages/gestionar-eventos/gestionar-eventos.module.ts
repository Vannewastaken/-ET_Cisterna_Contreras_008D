import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarEventosPageRoutingModule } from './gestionar-eventos-routing.module';

import { GestionarEventosPage } from './gestionar-eventos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarEventosPageRoutingModule
  ],
  declarations: [GestionarEventosPage]
})
export class GestionarEventosPageModule {}
