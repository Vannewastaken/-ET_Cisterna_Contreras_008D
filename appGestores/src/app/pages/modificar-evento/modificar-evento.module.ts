import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarEventoPageRoutingModule } from './modificar-evento-routing.module';

import { ModificarEventoPage } from './modificar-evento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModificarEventoPageRoutingModule
  ],
  declarations: [ModificarEventoPage]
})
export class ModificarEventoPageModule {}
