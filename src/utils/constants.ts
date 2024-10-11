const PRODUCTION_DOMAIN = 'https://vica-twitter-api.vercel.app/'
const DEVELOPMENT_DOMAIN = 'http://localhost:3000'

export const DOMAIN =
  process.env.NODE_ENV === 'production' ? PRODUCTION_DOMAIN : DEVELOPMENT_DOMAIN
