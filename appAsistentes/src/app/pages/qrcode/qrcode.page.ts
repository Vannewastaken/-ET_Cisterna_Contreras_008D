import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode'; // Si tienes un servicio para QR
import { EventDataService } from 'src/app/services/event-data.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {
  eventCode: string = '';
  isRegistered: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventservice: EventDataService
  ) { }


  

  
  




  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['qrData']) {
        const qrData = JSON.parse(params['qrData']);
        const qrDataObj = JSON.parse(params['qrData']);
        console.log('Datos recibidos para QR:', qrDataObj);
        // Generar el string del código QR con la información del evento, RUT y correo
        this.eventCode = `ID Evento: ${qrData.idEvento}\nEvento: ${qrData.nombre}\nFecha: ${qrData.fecha}\nUsuario: ${qrData.username}\nEmail: ${qrData.email}`;
        this.isRegistered = true;
      }

    })
  }

}

