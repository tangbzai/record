import type { ElectronType } from '../main/preload';

declare global {
  interface Window {
    electron: ElectronType;
  }
}

export {};
