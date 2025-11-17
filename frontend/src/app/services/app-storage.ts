import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class AppStorageService {
  private ready: Promise<void>;

  constructor(private storage: Storage) {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    await this.storage.create();
  }

  private async ensureReady(): Promise<void> {
    await this.ready;
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    await this.ensureReady();
    await this.storage.set(key, value);
  }

  async get<T = any>(key: string): Promise<T | null> {
    await this.ensureReady();
    return this.storage.get(key);
  }

  async remove(key: string): Promise<void> {
    await this.ensureReady();
    await this.storage.remove(key);
  }

  async clear(): Promise<void> {
    await this.ensureReady();
    await this.storage.clear();
  }
}