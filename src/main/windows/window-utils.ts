import { WebPreferences } from 'electron';

export interface WindowContext {
  pref: WebPreferences;
  indexPath: string;
  getRes: (...paths: string[]) => string;
}
