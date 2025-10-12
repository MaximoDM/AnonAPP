export class User {
  id: number;
  alias: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: Date;

  constructor(data: Partial<User> = {}) {
    this.id = data.id ?? 0;
    this.alias = data.alias?.trim() ?? '';
    this.name = data.name?.trim() || this.alias || 'Usuario Anónimo';
    this.email = data.email?.toLowerCase() ?? '';
    this.avatar = data.avatar || 'assets/default-avatar.png';
    this.bio = data.bio?.trim() || 'Sin biografía';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
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
    });
  }

  get displayName(): string {
    return this.alias || this.name || 'Usuario Anónimo';
  }

  get avatarUrl(): string {
    if (!this.avatar) return 'assets/default-avatar.png';
    return this.avatar.startsWith('http')
      ? this.avatar
      : `http://localhost:8080/uploads/avatars/${this.avatar}`;
  }
}
