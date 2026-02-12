import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'fitByte | Premium Health & Bio-Nutrition',
    short_name: 'fitByte',
    description: 'India\'s premier bio-nutrition label. Optimized health meeting high-performance bio-hacking. Discover our premium supplements and energy essentials.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait',
    categories: ['shopping', 'lifestyle', 'fashion'],
    icons: [
      {
        src: '/fitbyte-logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/fitbyte-logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
    screenshots: [
      {
        src: '/hero-banner.png',
        sizes: '1920x1080',
        type: 'image/png',
        label: 'Home Screen'
      },
      {
         src: '/fitbyte-logo.jpg',
         sizes: '512x512',
         type: 'image/jpeg',
         label: 'App Icon'
      }
    ],
    shortcuts: [
      {
        name: 'New Drops',
        short_name: 'Drops',
        description: 'Check out the latest arrivals',
        url: '/shop?sort=newest',
        icons: [{ src: '/flash-logo.jpg', sizes: '192x192' }]
      },
      {
        name: 'My Account',
        short_name: 'Account',
        description: 'View orders and profile',
        url: '/account',
        icons: [{ src: '/flash-logo.jpg', sizes: '192x192' }]
      }
    ]
  }
}
