import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena2',
  templateUrl: './recuperar-contrasena2.page.html',
  styleUrls: ['./recuperar-contrasena2.page.scss'],
})
export class RecuperarContrasena2Page implements OnInit {

  constructor(private alertcontroller: AlertController,
    private router:Router) { }

  ngOnInit() {
  }

  async ActualizarPassword(){

    const alert = await this.alertcontroller.create({
      header: 'Su contraseña ha sido actualizada!',
      message: 'Inicie sesión con su nueva contraseña',
      mode: 'ios',
      buttons: [
        {
          text: 'Log In',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/login']);
          },
        },
      ],
    });
  
    await alert.present();
  
  }

}
