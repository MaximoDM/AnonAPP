import { Component, OnInit } from '@angular/core';
import { MessagesService, Mensaje } from 'src/app/services/messages.service';
import { UserService, Usuario } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  usuario!: Usuario;
  respuestas: Mensaje[] = [];

  constructor(
    private msgService: MessagesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.usuario = this.userService.obtenerUsuario();
    this.respuestas = this.msgService.obtenerRespondidos();
  }

  abrirAjustes() {
    console.log('Ir a settings');
  }
}
