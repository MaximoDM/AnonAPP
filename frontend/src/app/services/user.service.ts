import { Injectable } from '@angular/core';

export interface Usuario {
  nombre: string;
  avatar: string;
  bio: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuario: Usuario = {
    nombre: 'Pedro',
    avatar: 'assets/avatar.png',
    bio: 'Creador de Anonapp. A veces respondo, otras pienso.',
  };

  obtenerUsuario(): Usuario {
    return this.usuario;
  }

  actualizarUsuario(datos: Partial<Usuario>) {
    this.usuario = { ...this.usuario, ...datos };
  }
}
