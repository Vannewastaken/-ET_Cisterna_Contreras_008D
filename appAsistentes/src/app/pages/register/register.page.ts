import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserNuevo } from 'src/interfaces/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registroForm: FormGroup;

  // Definir nuevoUsuario como propiedad de la clase
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
  };

  userdata: any;


  constructor(private authservice: AuthService, 
    private alertcontroller: AlertController,
    private router: Router,
    private fBuilder: FormBuilder) 
    
    {
      this.registroForm = this.fBuilder.group({ 
        'username' : new FormControl ("", [Validators.required, Validators.minLength(6)]),
        'email': new FormControl ("", [Validators.required, Validators.email]),
        'password': new FormControl("", [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
        'confirmPassword': new FormControl("", [Validators.required])
      },
  
  
      {
        validators: this.passwordMatchValidator  // Aplicar la validación personalizada aquí
      }); 
    }

  ngOnInit() {
  }
  crearUsuario() {
    if (this.registroForm.valid) {
      this.authservice.GetUserByUsername(this.registroForm.value.username).subscribe(resp => {

        this.userdata = resp;
        if (this.userdata.length > 0) {
          this.registroForm.reset();
          this.errorDuplicidad();
        } else {
          // Solo almacena los datos del usuario sin llamar a PostUsuario
          this.nuevoUsuario.username = this.registroForm.value.username;
          this.nuevoUsuario.password = this.registroForm.value.password;
          this.nuevoUsuario.email = this.registroForm.value.email;

          // Navegar a la segunda página con los datos del formulario
          this.router.navigate(['/register2'], {
            state: { data: this.nuevoUsuario }
          });
        }
      });
    }
  }



  async errorDuplicidad() {
    const alerta = await this.alertcontroller.create({
      header: 'Error..',
      message: 'El usuario ' + this.nuevoUsuario.username + ' ya está registrado.',  // Usa el objeto nuevoUsuario
      buttons: ['OK']
    });
    alerta.present();
  }



  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    // Verifica si ambos campos existen y tienen valor
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }


  }
}
