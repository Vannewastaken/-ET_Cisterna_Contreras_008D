import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserNuevo } from 'src/interfaces/users';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.page.html',
  styleUrls: ['./register2.page.scss'],
})
export class Register2Page implements OnInit {

  detallesForm: FormGroup;
  nuevoUsuario: UserNuevo = {
    id: Math.floor(Math.random() * 1000000000),  // Generar ID numérico
    username: "",
    email: "",
    password: "",
    isactive: true,
    nombres: "",
    apellidos: "",
    telefono: 0,
    imagen:"",
    rut: ""
  }; // Inicialización con un objeto vacío

  constructor(private authservice: AuthService,
    private alertcontroller: AlertController,
    private router: Router,
    private fBuilder: FormBuilder) 
    {
    this.detallesForm = this.fBuilder.group({
      'nombres': new FormControl ("", [Validators.required, Validators.minLength(3)]),
      'apellidos': new FormControl ("", [Validators.required, Validators.minLength(3)]),
      'telefono': new FormControl("", [Validators.required, Validators.pattern('^[0-9]{8}$')]), // Ajusta el patrón según tus requisitos
    });
  }

  ngOnInit() {
    this.nuevoUsuario = history.state.data; // O la manera que estés usando para pasar datos
  }


guardarUsuarioCompleto() {
    if (this.detallesForm.valid) {
      // Completar el objeto nuevoUsuario con los valores de la segunda parte del formulario
      this.nuevoUsuario.nombres = this.detallesForm.value.nombres;
      this.nuevoUsuario.apellidos = this.detallesForm.value.apellidos;
      this.nuevoUsuario.telefono = this.detallesForm.value.telefono;

      // Llama al método de guardar el usuario en la API
      this.authservice.PostUsuario(this.nuevoUsuario).subscribe(() => {
        this.mostrarMensaje();
        this.router.navigateByUrl('/login'); // Redirigir a la página de inicio
      });
    }
  }

  async mostrarMensaje() {
    const alerta = await this.alertcontroller.create({
      header: 'Usuario creado',
      message: 'Bienvenid@! ' + this.nuevoUsuario.username + ' Inicia sesión para disfrutar de la app!',
      buttons: ['OK']
    });
    alerta.present();
  }

}
