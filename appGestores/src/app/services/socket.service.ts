import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Conéctate al servidor WebSocket en Render
    this.socket = io('https://socket-jds0.onrender.com');
  }

  // Emitir evento cuando el QR sea escaneado
  emitirQREscaneado(data: { username: string; evento: string }) {
    this.socket.emit('qrEscaneado', data);
  }
}
