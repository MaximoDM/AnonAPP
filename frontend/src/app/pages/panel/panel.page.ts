import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { AppStorageService } from 'src/app/services/app-storage'; 


@Component({
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
  standalone: false,
})
export class PanelPage implements OnInit {
  topUsuarios: User[] = [];
  searchResults: User[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private appStorage: AppStorageService
  ) {}

  ngOnInit() {
    this.cargarTopUsuarios();
  }

  cargarTopUsuarios() {
    this.userService.getTopUsuarios().subscribe({
      next: (data) => (this.topUsuarios = data),
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  buscarUsuario(event: any) {
    const query = (event.target.value || '').toLowerCase().trim();

    if (!query) {
      this.searchResults = [];
      return;
    }

    this.userService.searchUsuarios(query).subscribe({
      next: (users) => {
        this.searchResults = users;
      },
      error: (err) => {
        console.error('Error buscando usuarios', err);
      },
    });
  }

  verPerfil(user: User) {
    if (user.alias) {
      this.router.navigate(['/profile', user.alias]);
    }
  }

  async goToMyProfile() {
    const alias = await this.appStorage.get<string>('alias');
    if (alias) {
      this.router.navigate(['/profile', alias]);
    }
  }

  goToMyMessages() {
    this.router.navigate(['/feed']);
  }
}
