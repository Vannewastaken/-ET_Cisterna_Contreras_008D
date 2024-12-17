import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

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
export class AppComponent {
  menu: Menu[] = [
    {
      icon: 'person-circle-outline',
      name: 'Perfil',
      redirecTo: '/perfil',
    },
    {
      icon: 'calendar-outline',
      name: 'Eventos',
      redirecTo: '/eventos',
    },
    {
      icon: 'create-outline',
      name: 'Crear eventos',
      redirecTo: '/crear-evento',
    },
    {
      icon: 'chatbox-outline',
      name: 'Mensajes',
      redirecTo: '/mensajes',
    },
    {
      icon: 'close-circle-outline',
      name: 'Cerrar sesión',
      redirecTo: '/login',
    },
  ];

  constructor(private authservice: AuthService, private router: Router) {
    // Listener para Deep Links
    App.addListener('appUrlOpen', (event) => {
      console.log('Deep Link recibido:', event.url);

      if (event.url) {
        // Parsear el URL
        const url = new URL(event.url);
        const token = url.searchParams.get('token');
        const path = url.pathname;

        console.log('Path:', path, 'Token:', token);

        // Redirigir al reset-password si el path y token son válidos
        if (path === '/reset-password' && token) {
          this.router.navigate(['/reset-password'], { queryParams: { token } });
        }
      }
    });

    // Ejecutar Deep Link si la app está ya abierta y el intent se envía
    window.addEventListener('DOMContentLoaded', () => {
      const url = window.location.href;
      console.log('Verificando URL al cargar:', url);

      if (url.startsWith('miapp://')) {
        const deepUrl = new URL(url);
        const token = deepUrl.searchParams.get('token');
        const path = deepUrl.pathname;

        if (path === '/reset-password' && token) {
          this.router.navigate(['/reset-password'], { queryParams: { token } });
        }
      }
    });
    
  }

  handleMenuItemClick(menuItem: Menu) {
    if (menuItem.name === 'Cerrar sesión') {
      this.logout(); // Llama al método de logout si el item es "Cerrar sesión"
    } else {
      this.router.navigate([menuItem.redirecTo]); // Redirige a la ruta correspondiente
    }
  }

  // Método para cerrar sesión
  logout() {
    this.authservice.logout(); // Llama al método de logout del AuthService
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}
