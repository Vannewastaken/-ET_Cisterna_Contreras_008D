import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/interfaces/users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;
  nuevaImagen: string | null = null; // Variable para la nueva imagen


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Obtener el usuario logueado desde el sessionStorage
    const usuarioData = sessionStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
    }
  }
  ionViewWillEnter() {
    this.loadUsuario();  // Recargar usuario cada vez que se entra al tab1
  }

  // Cargar los datos del usuario logueado
  loadUsuario() {
    const username = sessionStorage.getItem('username');
    
    if (username) {
      this.authService.GetUserByUsername(username).subscribe((gestores: Users[]) => {
        if (gestores.length > 0) {
          this.usuario = gestores[0];  // Tomamos el primer usuario encontrado
        }
      });
    }
  }

  seleccionarImagen() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.onFileSelected(event);
      }
    };

    input.click();
  }


    // Guardar la nueva imagen de perfil
    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.nuevaImagen = reader.result as string; // Convertir la imagen a base64
          this.guardarImagen();
        };
        reader.readAsDataURL(file); // Leer el archivo como DataURL
      }
    }

    // Guardar la nueva imagen de perfil
    guardarImagen() {
      if (this.usuario && this.nuevaImagen) {
        // Actualizar la imagen del usuario en el servicio
        this.authService.updateUserImage(this.usuario.id, this.nuevaImagen).subscribe(() => {
          // Actualiza la imagen localmente
          this.usuario.imagen = this.nuevaImagen;

          // Actualizar la sesión con la nueva imagen
          this.authService.saveUser(this.usuario); // Asegúrate de tener este método para actualizar el usuario en sessionStorage
        });
      }
    }


  // Navegar a la página de edición de perfil
  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }

}
