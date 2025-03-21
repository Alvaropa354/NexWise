# NexWise


## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Git

## Configuración del Entorno

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd nexwise
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o si usas yarn
   yarn install
   ```

3. **Configuración de variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus credenciales:
   - Configura las variables de Supabase
   - Añade cualquier otra variable de entorno necesaria

4. **Configuración de Supabase**
   - Asegúrate de tener una cuenta en Supabase
   - Crea un nuevo proyecto en Supabase
   - Copia las credenciales necesarias al archivo `.env`

## Ejecutar la Aplicación

1. **Desarrollo local**
   ```bash
   npm start
   # o
   yarn start
   ```

2. **Opciones de ejecución**
   - Presiona `a` para abrir en Android
   - Presiona `i` para abrir en iOS
   - Presiona `w` para abrir en web

## Estructura del Proyecto

```
nexwise/
├── app/              # Código fuente principal
├── assets/           # Recursos estáticos
├── config/           # Configuraciones
├── supabase/         # Configuración de Supabase
├── tests/           # Tests
└── docs/            # Documentación
```

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm test`: Ejecuta los tests
- `npm run build`: Construye la aplicación para producción
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código

## Guías de Desarrollo

1. **Convenciones de Código**
   - Seguir las reglas de ESLint
   - Usar Prettier para formateo
   - Seguir las convenciones de TypeScript

2. **Flujo de Trabajo Git**
   - Crear una rama para cada feature
   - Seguir el formato de commits convencional
   - Hacer PR para revisión de código

## Despliegue

1. **Preparación**
   - Verificar que todas las variables de entorno estén configuradas
   - Ejecutar los tests
   - Actualizar la versión en package.json

2. **Build y Publicación**
   ```bash
   expo build:android
   # o
   expo build:ios
   ```

## Soporte

Para preguntas o problemas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

## Licencia

Este proyecto está bajo la licencia especificada en el archivo LICENSE.

## Características

- **Identificación de Problemas**: Descubre y valida problemas reales del mercado.
- **Análisis de Mercado**: Estudia productos existentes y oportunidades de innovación.
- **Ciclo de Vida de Problemas**: Sigue el progreso de los problemas desde su identificación hasta su resolución.
- **Sistema de Recomendaciones**: Encuentra problemas relevantes basados en tu perfil y experiencia.

## Tecnologías Utilizadas

- React Native
- Expo
- TypeScript
- Supabase
- React Native Paper

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@example.com

Link del Proyecto: [https://github.com/tu-usuario/nexwise](https://github.com/tu-usuario/nexwise) 

