import { Component, OnInit } from '@angular/core';
import { EventDataService } from '../services/event-data.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Users } from 'src/interfaces/users';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  eventosInscritos: any[] = [];
  usuarioId!: number;
  usuarioEmail!: string;  // Guardar el email del usuario


  constructor(
    private eventService: EventDataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsuario();  // Cargar el usuario cuando el componente se inicializa
  }
 // ionViewWillEnter() {
   // this.loadEventosInscritos();  // Recargar eventos inscritos
  //}

  // Cargar el usuario autenticado
  loadUsuario() {
    const username = sessionStorage.getItem('username'); // Obtener el nombre de usuario logueado desde sessionStorage
    
    if (!username) {
      console.error('No se encontró el nombre de usuario en sessionStorage.');
      return;
    }
  
    this.authService.GetUserByUsername(username).subscribe((usuarios: Users[]) => {
      if (usuarios.length > 0) {
        const usuario = usuarios[0]; // Tomamos el primer usuario del arreglo
        this.usuarioId = usuario.id; // Obtener el ID del usuario autenticado
        this.usuarioEmail = usuario.email; // Obtener el email del usuario
        console.log('Usuario ID:', this.usuarioId);
        console.log('Usuario Email:', this.usuarioEmail);
  
        this.loadEventosInscritos(); // Cargar los eventos en los que el usuario está inscrito
      } else {
        console.error('No se pudo obtener el usuario.');
      }
    }, error => {
      console.error('No se encontró el usuario en sessionStorage.', error);
    });
  }
  

  // Cargar los eventos en los que el usuario está inscrito
  loadEventosInscritos() {
    // Obtener los registros de eventos en los que el usuario está inscrito
    this.eventService.getRegistrosByUsuario(this.usuarioId).subscribe(registros => {
      const eventoIds = registros.map(registro => registro.eventoId);  // Obtener los IDs de los eventos
  
      if (eventoIds.length > 0) {
        // Iterar sobre cada ID de evento y obtener sus detalles
        eventoIds.forEach(eventoId => {
          this.eventService.getEventoById(eventoId).subscribe(evento => {
            this.eventosInscritos.push(evento);  // Guardar cada evento inscrito en el array
          }, error => {
            //console.error('Error al cargar los detalles del evento:', error);
          });
        });
      }
    }, error => {
      //console.error('Error al cargar los registros del usuario:', error);
    });
  }
  

  // Navegar a los detalles del evento
  verDetalles(eventoId: number) {
    this.router.navigate([`/detalle-eventos/${eventoId}`]);
  }

  // Generar el QR Code con los datos del evento
  verQrCode(evento: any) {

    const username = sessionStorage.getItem('username');
    const qrData = {
      idEvento: evento.id,
      nombre: evento.nombre,
      fecha: evento.fecha,
      username: username,  // Ocho primeros caracteres del RUT
      email: this.usuarioEmail  // Usar el email del usuario autenticado
    };
    console.log('Datos del QR:', qrData);
    this.router.navigate(['/qrcode'], { queryParams: { qrData: JSON.stringify(qrData) } });
  }
}
