import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private authService: AuthService, private alertController: AlertController) {}

  async onSubmit() {
    this.authService.requestPasswordReset(this.email).subscribe({
      next: async () => {
        await this.presentAlert('Éxito', 'Correo enviado con éxito. Revisa tu bandeja de entrada.');
      },
      error: async (err) => {
        if (err.status === 404) {
          await this.presentAlert('Error', 'El correo no está registrado.');
        } else {
          await this.presentAlert('Error', 'Hubo un error. Inténtalo más tarde.');
        }
      },
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
