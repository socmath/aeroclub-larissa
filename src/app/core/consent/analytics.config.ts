import { InjectionToken } from '@angular/core';

/**
 * Google Tag Manager container ID (looks like 'GTM-XXXXXXX').
 * Leave empty to disable tag management entirely: no script is loaded and no cookie banner is shown.
 */
export const GTM_CONTAINER_ID_VALUE = 'GTM-MKNCNGMQ';

export const GTM_CONTAINER_ID = new InjectionToken<string>('GTM_CONTAINER_ID', {
  providedIn: 'root',
  factory: () => GTM_CONTAINER_ID_VALUE,
});
