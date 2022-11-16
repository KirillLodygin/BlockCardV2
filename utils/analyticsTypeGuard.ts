import has from 'lodash/has';

import { AnalyticsEntityType, NotificationKeys } from '../analytics';

/**
 * type guard
 * @param {NotificationKeys} key
 * @param {string} path
 * path starts after parent keys of object
 * like 'blockCard.text'
 */
export const isKeyInAnalyticsMap = <T>(
  obj: AnalyticsEntityType['analyticsMap'],
  key: NotificationKeys,
  path?: string,
): obj is T extends AnalyticsEntityType['analyticsMap'] ? T : never => has(obj, path ? `${key}.${path}` : key);
