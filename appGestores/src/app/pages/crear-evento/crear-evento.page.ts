import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventDataService } from 'src/app/services/event-data.service';
import { Ievento } from 'src/interfaces/eventos';

import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage {

  newEvento: Ievento = {
    nombre: "",
    fecha: "",
    lugar: "",
    descripcion: "",
    aforo: 0,
    imagen: ""
  };
  seleccionarImagenEvento() {
    const fileInput: HTMLElement | null = document.getElementById('fileInputEvento');
    fileInput?.click();
  }

  onFileSelectedEvento(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newEvento.imagen = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  crearForm: FormGroup;

  eventos: Ievento[] = [];
  constructor(
    private apieventos: EventDataService,
    private router: Router,
    private builder: FormBuilder
  ) {
    this.crearForm = this.builder.group({
      'nombre': new FormControl("", [Validators.required, Validators.minLength(6)]),
      'aforo': new FormControl("", [Validators.required, Validators.pattern("^[1-9][0-9]*$"), Validators.min(1)]),
      'fecha': new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]),
      'lugar': new FormControl("", [Validators.required, Validators.minLength(10)]),
      'descripcion': new FormControl("", [Validators.required, Validators.minLength(20)])
    })
  }

  ngOnInit() {
    this.cargarEventos();
  }

  ionViewWillEnter() {
    this.cargarEventos();  // Recargar los eventos cada vez que se entra en la página
  }
  cargarEventos() {
    this.apieventos.getEventos().subscribe(data => {
      this.eventos = data;
    });
  }

  crearEvento() {
    if (this.crearForm.valid) {
      this.apieventos.postEvento(this.newEvento).subscribe();
      this.router.navigateByUrl("/eventos")
    }

  }
}