module.exports = {
  expo: {
    name: 'NexWise',
    slug: 'nexwise',
    version: '1.0.0',
    orientation: 'portrait',
    // Comentamos las referencias a imágenes que no existen
    // icon: './assets/icon.png',
    
    userInterfaceStyle: 'light',
    splash: {
      // image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        // foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      // favicon: './assets/favicon.png'
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      },
      // Deshabilitamos las herramientas de desarrollo para evitar problemas
      disableDevTools: true
    },
    // Configuración de desarrollo para evitar problemas con DevTools
    developmentClient: {
      silentLaunch: true
    },
    plugins: [
      'expo-router'
    ]
  }
}; 