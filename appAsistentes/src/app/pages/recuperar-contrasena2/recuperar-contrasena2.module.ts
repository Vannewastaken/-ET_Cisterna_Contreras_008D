import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarContrasena2PageRoutingModule } from './recuperar-contrasena2-routing.module';

import { RecuperarContrasena2Page } from './recuperar-contrasena2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarContrasena2PageRoutingModule
  ],
  declarations: [RecuperarContrasena2Page]
})
export class RecuperarContrasena2PageModule {}
