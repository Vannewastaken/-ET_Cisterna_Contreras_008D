import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Conexión con el servidor Socket.IO
    this.socket = io('https://socket-jds0.onrender.com'); 
  }

  // Escuchar notificaciones
  escucharNotificacion(callback: (data: any) => void) {
    this.socket.on('notificacionQR', callback);
  }
}
