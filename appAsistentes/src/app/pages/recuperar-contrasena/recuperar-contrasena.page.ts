import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {

  constructor(private alertcontroller: AlertController,
    private router:Router) { }

  ngOnInit() {
  }
  async RecuperarPassword2(){

    const alert = await this.alertcontroller.create({
      header: 'Correo enviado!',
      message: 'Te ha llegado un link al email que ingresaste para que puedas actualizar tu contraseña',
      mode: 'ios',
      buttons: [
        {
          text: 'Siguiente(Esto solo x fines educativos)',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/recuperar-contrasena2']);
          },
        },
      ],
    });
  
    await alert.present();
  
  }

}
