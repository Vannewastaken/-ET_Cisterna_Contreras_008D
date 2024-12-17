import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Verificar si el token es recibido desde queryParams
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      console.log('Token en reset-password page:', this.token);
    });
  }
}