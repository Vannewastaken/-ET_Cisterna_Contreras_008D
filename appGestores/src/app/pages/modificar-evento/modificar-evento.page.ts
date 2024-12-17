import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDataService } from 'src/app/services/event-data.service';
import { AlertController } from '@ionic/angular';

import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-modificar-evento',
  templateUrl: './modificar-evento.page.html',
  styleUrls: ['./modificar-evento.page.scss'],
})
export class ModificarEventoPage implements OnInit {

  evento: any;

  eventito = {
    id: 0,
    nombre: "",
    fecha: "",
    lugar: "",
    descripcion: "",
    aforo: 0,
    imagen: ""
  }


  modificarForm: FormGroup;

  constructor(
    private activated: ActivatedRoute,
    private apieventos: EventDataService,
    private router: Router,
    private alert: AlertController,
    private builder: FormBuilder
  ) {
    this.activated.queryParams.subscribe(param => {
      this.evento = JSON.parse(param['evento']);
    }),
      this.modificarForm = this.builder.group({
        'nombre': new FormControl("", [Validators.required, Validators.minLength(6)]),
        'aforo': new FormControl("", [Validators.required, Validators.pattern("^[1-9][0-9]*$"), Validators.min(1)]),
        'fecha': new FormControl("", [Validators.required,Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d{4}-\d{2}-\d{2}$/) ]),
        'lugar': new FormControl("", [Validators.required, Validators.minLength(10)]),
        'descripcion': new FormControl("",[Validators.required,  Validators.minLength(20)])
      })

  }

  ngOnInit() {
    this.eventito = this.evento;
  }

  actualizarEvento(Observable: any) {
    if (this.modificarForm.valid){
      this.apieventos.putEvento(this.eventito).subscribe();
      this.mensaje();
    }

  }

  async mensaje() {
    const alert = await this.alert.create({
      header: 'Modificar',
      message: 'Su evento ha sido modificado',
      buttons: [
        {
          text: 'Ok',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/gestionar-eventos']);
          },
        },
      ],
    });
    await alert.present();
  }
  seleccionarImagenEvento() {
    const fileInput: HTMLElement | null = document.getElementById('fileInputEvento');
    fileInput?.click();
  }

  onFileSelectedEvento(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.eventito.imagen = reader.result as string; // Guardar imagen en base64
      };
      reader.readAsDataURL(file);
    }
  }


}
