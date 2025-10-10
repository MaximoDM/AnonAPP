import { Injectable } from '@angular/core';

export interface User {
  name: string;
  avatar: string;
  bio: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User = {
    name: 'Pedro',
    avatar: 'assets/avatar.png',
    bio: 'Creador de Anonapp. A veces respondo, otras pienso.',
  };

  getUser(): User {
    return this.user;
  }

  updateUser(data: Partial<User>) {
    this.user = { ...this.user, ...data };
  }
}
