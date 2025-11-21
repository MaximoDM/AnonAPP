// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tu.app',
  appName: 'Anonapp',
  webDir: 'www',
  android: {
    allowMixedContent: true
  }
};

export default config;
