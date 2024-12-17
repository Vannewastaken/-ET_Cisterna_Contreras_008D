import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/interfaces/users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {

  passwordType: string = 'password'; // Tipo de input, inicialmente "password"
  passwordIcon: string = 'eye-off';  // Ícono inicial (ojo cerrado)

  usuario: Users | null = null;
  newPassword: string = '';  // Campo para cambiar la contraseña
  selectedFile: File | null = null;  // Almacenar la imagen seleccionada

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadUsuario();
  }

  loadUsuario() {
    const username = sessionStorage.getItem('username');
    if (username) {
      this.authService.GetUserByUsername(username).subscribe((usuarios: Users[]) => {
        if (usuarios.length > 0) {
          this.usuario = usuarios[0];
        }
      });
    }
  }


  validatePhone(event: any) {
    const input = event.target.value as string;
    // Reemplaza cualquier carácter que no sea un número con una cadena vacía
    event.target.value = input.replace(/[^0-8]/g, '');
    this.usuario!.telefono = event.target.value;  // Actualiza el modelo con el valor filtrado
  }
  telefonoInvalido() {
    return this.usuario?.telefono && this.usuario.telefono.toString().length !== 8;
  }

  // Actualizar el perfil del usuario
  actualizarPerfil() {
    if (this.usuario) {
      if (this.telefonoInvalido()) {
        alert('El teléfono debe tener exactamente 8 dígitos.');
        return;
      }

      // Si la validación es correcta, actualiza el perfil del usuario
      this.authService.updateUser(this.usuario).subscribe(() => {
        this.router.navigate(['/tabs/tab1']);  // Volver al perfil después de guardar
      });
    }
  }

  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';  // Cambia el input a tipo "text" para mostrar la contraseña
      this.passwordIcon = 'eye';   // Cambia el ícono al ojo abierto
    } else {
      this.passwordType = 'password';  // Cambia de nuevo a "password" para ocultarla
      this.passwordIcon = 'eye-off';   // Cambia el ícono al ojo cerrado
    }
  }
}
