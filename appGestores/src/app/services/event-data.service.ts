import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Ievento, Ieventos, Asistente } from 'src/interfaces/eventos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventDataService {
  constructor(private httpclient: HttpClient) {}

  // Obtener el listado de eventos GET
  getEventos(): Observable<Ieventos[]> {
    return this.httpclient.get<Ieventos[]>(`${environment.apiUrl}/eventos`);
  }

  // Crear nuevo evento POST
  postEvento(newEvento: Ievento): Observable<Ievento> {
    return this.httpclient.post<Ievento>(`${environment.apiUrl}/eventos`, newEvento);
  }

  // Buscar evento por id
  getEventoId(id: number): Observable<Ieventos> {
    return this.httpclient.get<Ieventos>(`${environment.apiUrl}/eventos/?id=${id}`);
  }

  // Actualizar evento PUT
  putEvento(evento: any): Observable<Ieventos> {
    return this.httpclient.put<Ieventos>(`${environment.apiUrl}/eventos/${evento.id}`, evento);
  }

  // Eliminar evento DELETE
  deleteEvento(evento: any): Observable<Ieventos> {
    return this.httpclient.delete<Ieventos>(`${environment.apiUrl}/eventos/${evento.id}`);
  }

  // Registrar un asistente usando datos escaneados del QR
  registrarAsistente(asistente: Asistente): Observable<Asistente> {
    return this.httpclient.post<Asistente>(`${environment.apiUrl}/asistente`, asistente);
  }

  // Obtener la lista de asistentes GET
  getAsistentes(): Observable<Asistente[]> {
    return this.httpclient.get<Asistente[]>(`${environment.apiUrl}/asistente`);
  }

  // Nuevo método: Actualizar asistencia en la clase registros
  actualizarAsistencia(idevento: string, username: string): Observable<any> {
    // Buscar el registro por eventoId y username
    const url = `${environment.apiUrl}/registros?eventoId=${idevento}&username=${username}`;

    return this.httpclient.get<any[]>(url).pipe(
      switchMap((registros) => {
        if (registros.length > 0) {
          const registro = registros[0]; // Obtener el primer registro encontrado
          const updateUrl = `${environment.apiUrl}/registros/${registro.id}`;
          // Actualizar el campo asistencia a true
          return this.httpclient.patch(updateUrl, { asistencia: true });
        } else {
          console.error('No se encontró un registro para actualizar.');
          return throwError(() => new Error('Registro no encontrado.'));
        }
      })
    );
  }
}
