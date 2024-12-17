import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { EventDataService } from 'src/app/services/event-data.service';
import { SocketService } from 'src/app/services/socket.service';
import { Asistente } from 'src/interfaces/eventos';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit, OnDestroy {
  scannedCode: string | null = null;
  codeReader = new BrowserMultiFormatReader();
  videoElement!: HTMLVideoElement;
  stream: MediaStream | null = null;
  isVideoVisible: boolean = true;
  isProcessing: boolean = false;
  lastScannedCode: string | null = null;

  asistenteData: Asistente | null = null;

  constructor(
    private eventDataService: EventDataService,
    private socketService: SocketService // Inyección del servicio de Socket.IO
  ) {}

  // Inicializar el escáner
  async ngOnInit() {
    const permissionGranted = await this.checkOrRequestPermission();
    if (!permissionGranted) {
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
      return;
    }
    this.startScanner();
  }

  processScannedCode(code: string) {
    if (this.isProcessing || code === this.lastScannedCode) return;
  
    this.isProcessing = true;
    this.lastScannedCode = code;
  
    try {
      const asistente = this.parseQRCode(code);
  
      console.log('Datos del asistente escaneado:', asistente);
  
      this.asistenteData = asistente; // Asigna el asistenteData aquí
      console.log('Variable asistenteData actualizada:', this.asistenteData);
  
      this.stopScanner();
      this.isVideoVisible = false;
  
      // Registrar y actualizar asistencia
      this.registrarYActualizarAsistencia(asistente);
  
      // Emitir el evento al servidor Socket.IO
      this.socketService.emitirQREscaneado({
        username: asistente.username,
        evento: asistente.nombre,
      });
      console.log('Evento emitido al servidor Socket.IO:', {
        username: asistente.username,
        evento: asistente.nombre,
      });
  
    } catch (error) {
      console.error('Error al procesar el código QR:', error);
      alert('El código QR no tiene un formato válido.');
      this.isProcessing = false;
    }
  }

  // Parsear el contenido del código QR
  private parseQRCode(code: string): Asistente {
    const lines = code.split('\n');
    const idEvento = lines.find(line => line.startsWith('ID Evento:'))?.replace('ID Evento: ', '').trim() || 'Sin ID';
    const nombre = lines.find(line => line.startsWith('Evento:'))?.replace('Evento: ', '').trim() || 'Evento desconocido';
    const fecha = lines.find(line => line.startsWith('Fecha:'))?.replace('Fecha: ', '').trim() || new Date().toISOString();
    const username = lines.find(line => line.startsWith('Usuario:'))?.replace('Usuario: ', '').trim() || 'Sin Usuario';
    const email = lines.find(line => line.startsWith('Email:'))?.replace('Email: ', '').trim() || 'Sin Email';

    return { id: '', idevento: idEvento, nombre, fecha, username, email };
  }

  // Registrar y actualizar la asistencia
  private registrarYActualizarAsistencia(asistente: Asistente) {
    this.eventDataService.registrarAsistente(asistente).subscribe({
      next: () => {
        console.log('Asistente registrado con éxito.');

        this.eventDataService.actualizarAsistencia(asistente.idevento, asistente.username).subscribe({
          next: () => {
            console.log('Asistencia actualizada correctamente.');
            alert('¡Asistencia confirmada y registrada correctamente!');
            this.isProcessing = false;
          },
          error: err => {
            console.error('Error al actualizar asistencia en registros:', err);
            alert('Error al actualizar asistencia.');
            this.isProcessing = false;
          },
        });
      },
      error: err => {
        console.error('Error al registrar asistente:', err);
        alert('Error al registrar asistente. Verifica la conexión.');
        this.isProcessing = false;
      },
    });
  }

  // Solicitar permisos para usar la cámara
  async checkOrRequestPermission(): Promise<boolean> {
    try {
      const status = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (status.state === 'granted') return true;

      if (status.state === 'prompt') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      return false;
    }
  }

  // Iniciar el escáner
  async startScanner() {
    try {
      this.isVideoVisible = true;
      this.videoElement = document.getElementById('video') as HTMLVideoElement;

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();

      this.codeReader.decodeFromVideoElement(this.videoElement, (result, error) => {
        if (result) {
          this.scannedCode = result.getText();
          this.processScannedCode(this.scannedCode);
        }
        if (error) console.error('Error al escanear:', error);
      });
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
      this.isVideoVisible = false;
    }
  }

  // Detener el escáner
  stopScanner() {
    this.isProcessing = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.srcObject = null;
    }
    console.log('Cámara detenida.');
  }

  // Detener el escáner al destruir el componente
  ngOnDestroy() {
    this.stopScanner();
  }
}
