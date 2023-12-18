import { Settings } from 'luxon';

export function luxonDefaultConfig(): void {
  Settings.defaultLocale = 'pt-BR';
  Settings.defaultZone = 'UTC';
}
