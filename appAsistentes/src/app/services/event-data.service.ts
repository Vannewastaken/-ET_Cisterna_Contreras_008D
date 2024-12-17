import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventDataService {

  constructor(private http: HttpClient) { }

  // Obtener todos los eventos
  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/eventos`);
  }

  // Obtener un evento por ID
  getEventoById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/eventos/${id}`);
  }

  // Obtener los registros de un usuario
  getRegistrosByUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/registros?usuarioId=${usuarioId}`);
  }

  // Registrar a un usuario en un evento
  registrarEvento(eventoId: number, usuarioId: number, username: string, email: string, asistencia: boolean): Observable<any> {
    const nuevoRegistro = {
      eventoId,
      usuarioId,
      username,
      email,
      fechaRegistro: new Date().toISOString(),
      asistencia
    };
    return this.http.post<any>(`${environment.apiUrl}/registros`, nuevoRegistro);
  }

  // Cancelar la inscripción de un usuario en un evento
  cancelarRegistro(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/registros/${id}`);
  }
  guardarComentario(comentario: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/comentarios`, comentario);
  }





  


}
