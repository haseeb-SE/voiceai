import 'server-only'

const dictionaries = {
  en: () => import('../messages/en.json').then((module) => module.default),
  fr: () => import('../messages/fr.json').then((module) => module.default),
  es: () => import('../messages/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  if (!dictionaries[locale]) {
    return dictionaries.en()
  }
  return dictionaries[locale]()
}