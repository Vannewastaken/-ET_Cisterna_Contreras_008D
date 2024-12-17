import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';


import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/interfaces/users';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  usuario: any;

  constructor(private router: Router, private menucontroller: MenuController, private authService: AuthService) { }

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

  Eventos() {
    this.router.navigateByUrl('/eventos'); // Navega a la página de eventos
  }

  IrCuenta(){
    this.router.navigateByUrl('/tabs/tab1'); // Navega a la página de cuenta
  }

  mostrarMenu(){
    this.menucontroller.open('first');
  }
gestionarEventos() {
  this.router.navigateByUrl('/qr-scanner')
}
mensaje() {
  this.router.navigateByUrl('/mensajes')
}


}