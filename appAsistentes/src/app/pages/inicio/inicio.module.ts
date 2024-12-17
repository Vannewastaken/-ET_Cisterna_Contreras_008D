import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module';

import { InicioPage } from './inicio.page';

//carrusel
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    MdbCarouselModule
  ],
  declarations: [InicioPage]
})
export class InicioPageModule {}
