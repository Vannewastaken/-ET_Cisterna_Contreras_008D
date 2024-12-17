import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ieventos } from 'src/interfaces/eventos';
import { AlertController } from '@ionic/angular';
import { EventDataService } from 'src/app/services/event-data.service';

@Component({
  selector: 'app-gestionar-eventos',
  templateUrl: './gestionar-eventos.page.html',
  styleUrls: ['./gestionar-eventos.page.scss'],
})
export class GestionarEventosPage implements OnInit {
  unEvento: any; // No necesitamos declarar tipos adicionales aquí
  eventos: Ieventos[] = [];  // Almacena todos los eventos
  participantes: any[] = [];

  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private alertcontroller: AlertController,
    private apieventos: EventDataService
  ) {
    this.activated.queryParams.subscribe(param => {
      if (param['evento']) {
        this.unEvento = JSON.parse(param['evento']);
      }
    });
  }

  ngOnInit() {
    // Leer los parámetros de consulta para obtener el evento
    this.activated.queryParams.subscribe((params) => {
      if (params['evento']) {
        try {
          this.unEvento = JSON.parse(params['evento']); // Parsear el evento recibido
          this.cargarParticipantes(this.unEvento.id); // Cargar participantes vinculados al evento
        } catch (error) {
          console.error('Error al parsear el evento:', error);
          this.router.navigate(['/eventos']); // Redirigir si hay error
        }
      } else {
        console.error('No se recibió un evento en los parámetros.');
        this.router.navigate(['/eventos']); // Redirigir si no se recibe un evento
      }
    });
  }

  ionViewWillEnter() {
    this.cargarEventos();  // Recargar la lista de eventos cada vez que se regrese a esta página
  }

  // Método para cargar los eventos
  cargarEventos() {
    this.apieventos.getEventos().subscribe(
      (data) => {
        this.eventos = data;  // Guardamos todos los eventos
        // Si queremos que unEvento se actualice después de modificarlo
        // buscamos en la lista de eventos el evento actual y lo asignamos
        if (this.unEvento) {
          this.unEvento = this.eventos.find(evento => evento.id === this.unEvento.id);
        }
      },
      (err) => {
        console.error('Error cargando eventos:', err);
      }
    );
  }

 

  // Método para navegar a la página de modificación de evento
  actualizarEvento(Observable: Ieventos) {
    this.router.navigate(['/modificar-evento', this.unEvento?.id], {
      queryParams: { evento: JSON.stringify(Observable) },
    });
  }

  // Confirmación de eliminación
  async confirmarEliminacion() {
    const alert = await this.alertcontroller.create({
      header: 'Desea eliminar el evento?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: () => {
            this.elimina();
          },
        },
      ],
    });
    await alert.present();
  }

  // Método para eliminar un evento
  elimina() {
    if (this.unEvento) {
      this.apieventos.deleteEvento(this.unEvento).subscribe(() => {
        this.cargarEventos();  // Vuelve a cargar la lista de eventos después de eliminar
        this.mensaje();
      });
    }
  }

  // Mensaje de eliminación
  async mensaje() {
    const alert = await this.alertcontroller.create({
      header: 'Eliminación',
      message: 'El evento ha sido eliminado',
      buttons: [
        {
          text: 'Ok',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/eventos']);
          },
        },
      ],
    });
    await alert.present();
  }

  cargarParticipantes(eventoId: string) {
    this.apieventos.getAsistentes().subscribe(
      (asistentes) => {
        // Asegúrate de que la comparación se realiza correctamente como string
        this.participantes = asistentes.filter((asistente) => asistente.idevento === eventoId);
        console.log('Participantes cargados:', this.participantes);
      },
      (err) => {
        console.error('Error al cargar participantes:', err);
      }
    );
  }
}
