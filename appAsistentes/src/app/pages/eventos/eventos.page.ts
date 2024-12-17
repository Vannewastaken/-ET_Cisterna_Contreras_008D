import { Component, OnInit } from '@angular/core';
import { EventDataService } from 'src/app/services/event-data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  eventos: any[] = [];
  loading: boolean = true;
  usuarioId: number | null = null;  // Aquí almacenamos el ID del usuario autenticado

  constructor(private eventService: EventDataService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Obtener el ID del usuario logueado
    this.usuarioId = this.authService.GetUsuarioId();

    // Asegúrate de que el ID es válido (es un número)
    if (this.usuarioId) {
      this.loadEventos();
    } else {
      console.error('El usuario no tiene un ID válido.');
    }
  }

  ionViewWillEnter() {
    this.loadEventos();  // Recargar los eventos cada vez que entramos en la página
  }

  // Cargar los eventos y verificar en cuáles está inscrito el usuario logueado
  loadEventos() {
    this.eventService.getEventos().subscribe(eventos => {
      this.eventos = eventos;
      this.loading = false;
  
      // Verificar si `this.usuarioId` no es null antes de usarlo
      if (this.usuarioId) {
        // Verificar los eventos en los que está inscrito el usuario actual
        this.eventService.getRegistrosByUsuario(this.usuarioId).subscribe(registros => {
          const eventosInscritosIds = registros.map(registro => registro.eventoId);
  
          // Marcar los eventos en los que el usuario ya está inscrito
          this.eventos.forEach(evento => {
            evento.inscrito = eventosInscritosIds.includes(evento.id);
          });
        }, error => {
          console.error('Error al cargar registros de eventos', error);
        });
      } else {
        console.error('El usuario no tiene un ID válido.');
      }
    }, error => {
      console.error('Error al cargar eventos', error);
      this.loading = false;
    });
  }
  

  // Navegar a los detalles del evento
  verDetalles(eventoId: number) {
    this.router.navigate([`/detalle-eventos/${eventoId}`]);
  }


}
