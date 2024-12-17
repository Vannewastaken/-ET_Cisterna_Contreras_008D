import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserNuevo, Users } from 'src/interfaces/users';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;

  constructor(private httpclient: HttpClient) { }

  GetAllUsers():Observable<Users[]>{
    return this.httpclient.get<Users[]>(`${environment.apiUrl}/usuarios`);
  }

  GetUserByUsername(username: string): Observable<Users[]> {
    return this.httpclient.get<Users[]>(`${environment.apiUrl}/usuarios/?username=${username}`);
  }
  
  

  IsLoggedIn(){
    return sessionStorage.getItem('username')!=null;
  }
  getUser(): any {
    const usuarioData = sessionStorage.getItem('usuario'); 
    if (usuarioData) {
      try {
        return JSON.parse(usuarioData); // Convertir el string almacenado en JSON
      } catch (error) {
        console.error('Error al parsear el usuario almacenado:', error);
        return null;
      }
    }
    console.log('No se encontró ningún usuario en sessionStorage.');
    return null;
  }
  
  
  

      // Método para cerrar sesión
      logout() {
        sessionStorage.clear(); // Esto eliminará todos los elementos almacenados en sessionStorage
      }

      //Para registrar

      PostUsuario(newUsuario:UserNuevo): Observable<UserNuevo>{
        return this.httpclient.post<Users>(`${environment.apiUrl}/usuarios`, newUsuario);
      }
      
      GetUsuarioId(): number | null {
        const userId = sessionStorage.getItem('userId');
       return userId ? Number(userId) : null;
      }
      updateUser(updatedUser: Users): Observable<Users> {
        return this.httpclient.put<Users>(`${environment.apiUrl}/usuarios/${updatedUser.id}`, updatedUser);
      }
      updateUserImage(userId: number, image: string): Observable<Users> {
        return this.httpclient.patch<Users>(`${environment.apiUrl}/usuarios/${userId}`, { imagen: image });
      }
      
      saveUser(usuario: Users) {
        sessionStorage.setItem('user', JSON.stringify(usuario));
      }

}