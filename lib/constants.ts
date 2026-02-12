export const SITE_URL = 
  process.env.NODE_ENV === 'production' 
    ? (process.env.NEXT_PUBLIC_SITE_URL || 'https://fitbyte.in')
    : 'http://localhost:3000';
