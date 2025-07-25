// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(({ requestLocale }) => ({
  locale: requestLocale
}));
