import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage  {

  nombre: string = '';
  correo: string = '';
  asunto: string = '';

  constructor(private alertController: AlertController) {}

  async enviarFormulario() {
    console.log('Formulario enviado:', this.nombre, this.correo, this.asunto);

    const alert = await this.alertController.create({
      header: 'Enviado',
      message: 'Tu mensaje ha sido enviado correctamente.',
      buttons: ['OK']
    });

    await alert.present();
    this.nombre = '';
    this.correo = '';
    this.asunto = '';
  }
}