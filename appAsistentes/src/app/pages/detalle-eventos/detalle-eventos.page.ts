import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDataService } from 'src/app/services/event-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/interfaces/users';
import { AlertController } from '@ionic/angular';
import { format } from 'date-fns'; // Importar para formatear la fecha

@Component({
  selector: 'app-detalle-eventos',
  templateUrl: './detalle-eventos.page.html',
  styleUrls: ['./detalle-eventos.page.scss'],
})
export class DetalleEventosPage implements OnInit {
  evento: any;
  isRegistered: boolean = false;
  usuarioId!: number;
  usuario: any;
  usuarioEmail!: string;
  nuevoComentario: string = '';  // Para almacenar el comentario ingresado
  usuarioLogueado: any;
  comentarios: any[] = []; // Arreglo donde estarán los comentarios
  asistencia: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private eventService: EventDataService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {

  }

  ngOnInit() {
    this.loadUsuarioLogueado(); // Cargar los datos del usuario logueado al iniciar
  }

  ionViewWillEnter() {
    this.loadEvento(); // Recargar el evento cuando volvemos a la página
  }

  // Método para obtener el usuario logueado
  loadUsuarioLogueado() {
    const username = sessionStorage.getItem('username'); // Obtener el nombre de usuario logueado desde sessionStorage
    
    if (!username) {
      console.error('No se encontró el nombre de usuario en sessionStorage.');
      this.router.navigate(['/login']); // Redirigir al login si no hay usuario logueado
      return;
    }

    this.authService.GetUserByUsername(username).subscribe((usuarios: Users[]) => {
      if (usuarios.length === 0) {
        this.showAlert('Error', 'No se encontró el usuario.');
        this.router.navigate(['/login']); // Redirigir si no hay usuarios
      } else {
        const usuario = usuarios[0]; // Tomamos el primer usuario del arreglo
        this.usuarioId = usuario.id!; // Guardar el ID del usuario autenticado
        console.log('Usuario ID:', this.usuarioId);

        this.loadEvento(); // Cargar el evento una vez que tenemos al usuario
      }
    }, error => {
      console.error('No se pudo obtener el usuario:', error);
      this.router.navigate(['/login']);
    });
  }

  // Método para cargar el evento usando su ID
  loadEvento() {
    const eventoId = Number(this.route.snapshot.paramMap.get('id')); // Asegurarse de que eventoId sea un número
    const username = String(this.route.snapshot.paramMap.get('username'));
    // Validar si el usuario está autenticado y si tenemos un evento ID válido
    if (!this.usuarioId || isNaN(eventoId)) {
      console.log('No se pudo cargar el evento o el usuario no está autenticado.');
      return; // Salir si usuarioId es null o eventoId no es un número
    }
    console.log('Usuario:', username)
    console.log('Evento ID:', eventoId); // Depuración
    console.log('Usuario ID:', this.usuarioId); // Depuración

    // Obtener los detalles del evento por su ID
    this.eventService.getEventoById(eventoId).subscribe(evento => {
      this.evento = evento;

      // Verificar si el usuario ya está inscrito en el evento
      this.eventService.getRegistrosByUsuario(this.usuarioId).subscribe(registros => {
        const registroEvento = registros.find(registro => Number(registro.eventoId) === eventoId);

        if (registroEvento) {
          this.isRegistered = true;
          console.log('El usuario está inscrito en este evento.');
        } else {
          this.isRegistered = false;
          console.log('El usuario no está inscrito en este evento.');
        }

        this.updateButtonState(); // Actualizar los botones
      }, error => {
        console.error('Error al verificar la inscripción:', error);
      });
    }, error => {
      console.error('Error al cargar el evento:', error);
    });
  }

  // Actualizar los botones dependiendo de si el usuario está inscrito o no
  updateButtonState() {
    if (this.isRegistered) {
      console.log('El usuario ya está inscrito en este evento.');
    } else {
      console.log('El usuario no está inscrito en este evento.');
    }
  }


  // Registrar al usuario en el evento
register() {
  const username = sessionStorage.getItem('username'); // Verificar si el usuario está logueado

  if (!username) {
    this.showAlert('Error', 'Debes iniciar sesión para inscribirte en el evento.');
    this.router.navigate(['/login']);
    return;
  }

  this.eventService.getRegistrosByUsuario(this.usuarioId).subscribe(registros => {
    const yaInscrito = registros.some(registro => registro.eventoId === this.evento.id);
    
    if (!yaInscrito) {
      // Registrar al usuario en el evento
      this.eventService.registrarEvento(this.evento.id, this.usuarioId, username, this.usuarioEmail, this.asistencia).subscribe(() => {
        this.isRegistered = true;
        this.showAlert('Registro completado', 'Te has registrado en el evento.');
        this.updateButtonState();  // Actualizar el estado de los botones
      });
    } else {
      // Mostrar mensaje de error si ya está inscrito
      this.showAlert('Error', 'Ya estás inscrito en este evento.');
    }
  });
}


  // Cancelar la inscripción del usuario
  cancelarInscripcion() {
    this.eventService.getRegistrosByUsuario(this.usuarioId!).subscribe(registros => {
      const registro = registros.find(reg => reg.eventoId === this.evento.id);

      if (registro) {
        this.eventService.cancelarRegistro(registro.id).subscribe(() => {
          this.isRegistered = false;
          this.showAlert('Inscripción cancelada', 'Has cancelado tu inscripción en el evento.');
          this.updateButtonState();
        });
      }
    });
  }


  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  // Método para enviar comentario
  enviarComentario() {
    // Obtener el usuario logueado desde sessionStorage
    const usuario = this.authService.getUser(); 
    if (!usuario || !usuario.id) {
      console.error('No se pudo obtener el usuario logueado.');
      return;
    }

    // Validar si el usuario está inscrito en el evento
    this.eventService.getRegistrosByUsuario(usuario.id).subscribe(registros => {
      const registroEvento = registros.find(registro => registro.eventoId === this.evento.id);

      if (!registroEvento) {
        // El usuario no está registrado en este evento
        this.showAlert('Error', 'Solo puedes comentar eventos en los que has participado.');
        return;
      }

      // Validar si la fecha del evento ya ha pasado
      const fechaEvento = new Date(this.evento.fecha);
      const fechaActual = new Date();
      if (fechaEvento > fechaActual) {
        // El evento aún no ha pasado
        this.showAlert('Error', 'Solo puedes comentar eventos que ya han pasado.');
        return;
      }

      // Crear el nuevo comentario
      const nuevoComentario = {
        idEvento: this.evento.id, // ID del evento actual
        idUsuario: usuario.id, // ID del usuario logueado
        comentario: this.nuevoComentario, // El comentario en sí
        fecha: new Date().toISOString() // Fecha del comentario
      };

      // Guardar comentario en el almacenamiento
      this.guardarComentariosEnAlmacen(nuevoComentario);

      // Limpiar el campo de comentario
      this.nuevoComentario = '';
    });
  }
  
  

  // Guardar comentario en almacen.json
  guardarComentariosEnAlmacen(comentario: any) {
    // Simulamos una llamada al servicio que guarda el comentario en almacen.json
    this.eventService.guardarComentario(comentario).subscribe(() => {
      console.log('Comentario guardado con éxito');
    }, error => {
      console.error('Error al guardar el comentario:', error);
    });
  }
}