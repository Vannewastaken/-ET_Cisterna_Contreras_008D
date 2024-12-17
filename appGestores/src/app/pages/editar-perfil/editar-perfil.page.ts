import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/interfaces/users';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  passwordType: string = 'password'; // Tipo de input, inicialmente "password"
  passwordIcon: string = 'eye-off';  // Ícono inicial (ojo cerrado)

  gestor: Users | null = null;       // Datos del usuario
  modificarPerfilForm: FormGroup;    // Formulario reactivo

  constructor(private authService: AuthService, private router: Router, private builder: FormBuilder) {
    // Configurar formulario reactivo
    this.modificarPerfilForm = this.builder.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      password: ['', [Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
    });
  }

  ngOnInit() {
    this.loadUsuario();
  }

  // Cargar datos del usuario
  loadUsuario() {
    const username = sessionStorage.getItem('username');
    if (username) {
      this.authService.GetUserByUsername(username).subscribe((gestores: Users[]) => {
        if (gestores.length > 0) {
          this.gestor = gestores[0];
          // Cargar datos iniciales en el formulario
          this.modificarPerfilForm.patchValue({
            nombres: this.gestor.nombres,
            apellidos: this.gestor.apellidos,
            email: this.gestor.email,
            telefono: this.gestor.telefono,
          });
        }
      });
    }
  }

  // Validar el teléfono
  validatePhone(event: any) {
    const input = event.target.value as string;
    event.target.value = input.replace(/[^0-9]/g, ''); // Permitir solo números
    this.modificarPerfilForm.get('telefono')?.setValue(event.target.value);
  }

  telefonoInvalido() {
    return this.modificarPerfilForm.get('telefono')?.invalid;
  }

  // Actualizar perfil del usuario
  actualizarPerfil() {
    if (this.modificarPerfilForm.valid) {
      const datosActualizados = this.modificarPerfilForm.value;

      if (this.gestor) {
        const usuarioActualizado = { ...this.gestor, ...datosActualizados };
        this.authService.updateUser(usuarioActualizado).subscribe(() => {
          this.router.navigate(['/perfil']); // Navegar de vuelta al perfil
        });
      }
    } else {
      alert('Por favor, corrige los errores en el formulario.');
    }
  }

  // Alternar visibilidad de la contraseña
  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }
}
