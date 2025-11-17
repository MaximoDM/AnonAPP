export class User {
  id: number;
  alias: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: Date;
  totalComentarios?: number;
  role?: string;              

  constructor(data: Partial<User> = {}) {
    this.id = data.id ?? 0;
    this.alias = data.alias?.trim() ?? '';
    this.name = data.name?.trim() || this.alias || 'Usuario Anónimo';
    this.email = data.email?.toLowerCase() ?? '';
    this.avatar = data.avatar || '';
    this.bio = data.bio?.trim() || 'Sin biografía';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.totalComentarios = data.totalComentarios ?? 0;
    this.role = data.role ?? 'user';   
  }

  static fromApi(api: any): User {
    return new User({
      id: api?.id,
      alias: api?.alias,
      name: api?.name || api?.alias,
      email: api?.email,
      avatar: api?.avatar,
      bio: api?.bio,
      createdAt: api?.createdAt,
      totalComentarios: api?.totalComentarios,
      role: api?.role,                
    });
  }

  get displayName(): string {
    return this.alias || this.name || 'Usuario Anónimo';
  }

  get avatarUrl(): string {
    if (!this.avatar) {
      return 'assets/default-avatar.png';
    }

    if (this.avatar.startsWith('data:image')) {
      return this.avatar;
    }

    if (this.avatar.startsWith('http')) {
      return this.avatar;
    }

    return `http://localhost:8080/uploads/avatars/${this.avatar}`;
  }

  get isAdmin(): boolean {             
    return this.role === 'admin';
  }
}
