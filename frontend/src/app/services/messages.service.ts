import { Injectable } from '@angular/core';

export interface Mensaje {
  autor: string;
  texto: string;
  esAnonimo: boolean;
  fecha: Date;
  respuesta: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private mensajes: Mensaje[] = [
    { autor: 'Anónimo', texto: '¿Qué te motiva cada día?', esAnonimo: true, fecha: new Date(), respuesta: null },
    { autor: 'Pedro', texto: 'Buen trabajo con la app.', esAnonimo: false, fecha: new Date(), respuesta: 'Gracias.' },
    { autor: 'María', texto: '¿Cuál fue tu mejor decisión?', esAnonimo: false, fecha: new Date(), respuesta: 'Tomarme en serio mis ideas.' }
  ];

  obtenerTodos(): Mensaje[] {
    return this.mensajes;
  }

  obtenerPendientes(): Mensaje[] {
    return this.mensajes.filter(m => !m.respuesta);
  }

  obtenerRespondidos(): Mensaje[] {
    return this.mensajes.filter(m => m.respuesta);
  }

  responder(mensaje: Mensaje, textoRespuesta: string): void {
    const idx = this.mensajes.indexOf(mensaje);
    if (idx !== -1) {
      this.mensajes[idx].respuesta = textoRespuesta.trim();
    }
  }

  descartar(mensaje: Mensaje): void {
    this.mensajes = this.mensajes.filter(m => m !== mensaje);
  }
}
