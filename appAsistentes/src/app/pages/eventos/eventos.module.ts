import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EventosPageRoutingModule } from './eventos-routing.module';
import { EventosPage } from './eventos.page';

//carrusel
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventosPageRoutingModule,
    MdbCarouselModule
  ],
  declarations: [EventosPage]
})
export class EventosPageModule {}
