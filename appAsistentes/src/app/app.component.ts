import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SocketService } from './services/socket.service';

/** Interfaz para el menú de navegación */
interface Menu {
  icon: string;
  name: string;
  redirecTo: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  /** Configuración del menú de navegación */
  readonly menu: Menu[] = [
    {
      icon: 'person-circle-outline',
      name: 'Mi Perfil',
      redirecTo: '/tabs/tab1',
    },
    {
      icon: 'calendar-outline',
      name: 'Eventos',
      redirecTo: '/eventos',
    },
    {
      icon: 'call-outline',
      name: 'Contacto',
      redirecTo: '/contacto',
    },
    {
      icon: 'close-circle-outline',
      name: 'Cerrar sesión',
      redirecTo: '/login',
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService // Servicio de Socket.IO
  ) {}

  /** Método llamado al inicializar el componente */
  ngOnInit(): void {
    console.log('AppComponent inicializado');

    // Escuchar el evento de notificación del servidor Socket.IO
    this.socketService.escucharNotificacion((data) => {
      console.log('Notificación recibida:', data.mensaje);
      this.mostrarNotificacion(data.mensaje);
    });
  }

  /**
   * Manejar la acción cuando se hace clic en un elemento del menú.
   * @param menuItem Elemento del menú seleccionado.
   */
  handleMenuItemClick(menuItem: Menu): void {
    if (menuItem.name === 'Cerrar sesión') {
      this.logout();
    } else {
      this.navigateTo(menuItem.redirecTo);
    }
  }

  /**
   * Redirigir a la ruta especificada.
   * @param route Ruta a la que se desea navegar.
   */
  private navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Realiza el cierre de sesión y redirige al usuario a la página de inicio de sesión.
   */
  private logout(): void {
    this.authService.logout();
    this.navigateTo('/login');
    console.log('Sesión cerrada y redirigido al login.');
  }

  /**
   * Mostrar notificación al usuario cuando llega una desde el servidor.
   * @param mensaje Mensaje de la notificación.
   */
  private mostrarNotificacion(mensaje: string): void {
    if ('Notification' in window) {
      Notification.requestPermission().then((permiso) => {
        if (permiso === 'granted') {
          new Notification('Asistencia Verificada', { body: mensaje });
        } else {
          alert(mensaje); // Fallback si el usuario deniega las notificaciones
        }
      });
    } else {
      alert(mensaje); // Fallback si Notification API no está soportada
    }
  }
}
