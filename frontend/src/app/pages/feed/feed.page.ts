import { Component, OnInit } from '@angular/core';
import { MessagesService, Mensaje } from 'src/app/services/messages.service';

@Component({
  selector: 'app-feed',
  standalone: false,
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss']
})
export class FeedPage implements OnInit {
  mensajes: Mensaje[] = [];
  modalAbierto = false;
  mensajeActual: Mensaje | null = null;
  respuestaTemporal = '';

  constructor(private msgService: MessagesService) {}

  ngOnInit() {
    this.mensajes = this.msgService.obtenerPendientes();
  }

  abrirModal(msg: Mensaje) {
    this.mensajeActual = msg;
    this.respuestaTemporal = '';
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.mensajeActual = null;
    this.respuestaTemporal = '';
  }

  enviarRespuesta() {
    if (!this.respuestaTemporal.trim() || !this.mensajeActual) return;
    this.msgService.responder(this.mensajeActual, this.respuestaTemporal);
    this.mensajes = this.msgService.obtenerPendientes();
    this.cerrarModal();
  }

  descartar(msg: Mensaje) {
    this.msgService.descartar(msg);
    this.mensajes = this.msgService.obtenerPendientes();
  }
}
