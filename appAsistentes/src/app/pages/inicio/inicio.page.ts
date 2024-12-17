import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EventDataService } from 'src/app/services/event-data.service';



@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  usuario: string = '';
  eventos: any[]=[]

  constructor(private router: Router, private menucontroller: MenuController, private authService:AuthService, private eventData:EventDataService
  
  ) { }
  //para llamar al username guardado en el storage del navegador
  ngOnInit() {
    this.getUsuarioActual();
    this.verEventos();
  
  }

  ionViewWillEnter() {
    this.getUsuarioActual();  // Asegúrate de actualizar el nombre del usuario al entrar en la página
  }

  getUsuarioActual() {
    const user = this.authService.getUser();  // Obtén el usuario actual desde el servicio de autenticación
    if (user) {
      this.usuario = user.username;  // Actualiza el nombre del usuario actual
    } else {
      this.usuario = '';  // Si no hay usuario, limpia el nombre
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

  verEventos(){
    this.eventData.getEventos().subscribe(
      datos => this.eventos = datos,
    )
  }





}
