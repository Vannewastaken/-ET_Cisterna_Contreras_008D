import { Component, OnInit } from '@angular/core';

import { EventDataService } from 'src/app/services/event-data.service';
import { Ieventos } from 'src/interfaces/eventos';

import { Router } from '@angular/router';

@Component({
  selector: 'app-eventos',
  templateUrl: 'eventos.page.html',
  styleUrls: ['eventos.page.scss']
})
export class EventosPage implements OnInit {

  eventos: Ieventos[] = []

  constructor(private apieventos: EventDataService, private router:Router) { }

  ngOnInit() {
    this.apieventos.getEventos().subscribe((data) => {
      this.eventos = data
      }
    ),
    this.cargarEventos();
  }

  ionViewWillEnter() {
    this.cargarEventos(); // Recargar los eventos cada vez que la página es visible
  }
  cargarEventos() {
    this.apieventos.getEventos().subscribe(
      (data) => {
        this.eventos = data;
        console.log('Eventos actualizados:', this.eventos); // Verifica si se actualizan correctamente
      },
      (err) => {
        console.error('Error al cargar eventos:', err);
      }
    );
  }

  buscarEvento(Observable: Ieventos) {
    this.router.navigate(['/gestionar-eventos'], {
      queryParams: { evento: JSON.stringify(Observable) }
    });
  }
}




