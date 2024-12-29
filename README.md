# Chat en Tiempo Real

## Descripción

Este es un proyecto de una aplicación web de chat en tiempo real, construida con **React** y **Vite** para el frontend, y **Firebase** como backend y gestor de bases de datos. 
La aplicación permite a los usuarios registrarse, iniciar sesión con Google, agregar amigos y chatear en tiempo real con otros usuarios.

La aplicación fue diseñada para ofrecer una experiencia de usuario fluida, 
con un diseño responsive hecho con **Tailwind CSS** que se adapta a diferentes dispositivos. El backend utiliza **Firebase Realtime Database** para gestionar los mensajes y las sesiones de usuario, 
proporcionando actualizaciones en tiempo real.

**Propietario del Proyecto**: Alexander Gallego Vasquez

## Características

- Registro e inicio de sesión de usuarios mediante Google.
- Funcionalidad para agregar y gestionar amigos.
- Chat en tiempo real con actualizaciones instantáneas de mensajes.
- Envío de audios y de emojis en tiempo real.
- Diseño responsive para dispositivos móviles y de escritorio.
- Visualización del estado de los usuarios (conectado, pendiente, desconectado).

## Tecnologías Utilizadas

- **Frontend**: 
  - React
  - Vite
  - Tailwind CSS
  - FontAwesome (para íconos)
  - SweetAlert2 (para alertas)
  - Emoji Picker (para selección de emojis)
  - Wavesurfer.js (para reproducción de mensajes de audio)

- **Backend**:
  - Firebase (Realtime Database)
  - Firebase Authentication (para la autenticación de usuarios)
  
- **Otros**:
  - React Router (para navegación entre páginas)
  - Zustand (para el manejo del estado global de la aplicación)

## URL del Proyecto

La aplicación está alojada en Netlify y se puede acceder a través de la siguiente URL:

[https://chat-tiempo-real-alex.netlify.app/chat](https://chat-tiempo-real-alex.netlify.app/chat)

## Instalación y Configuración

1. **Clona el repositorio**:

```bash
   git clone https://github.com/tu-usuario/chat-tiempo-real.git
   cd chat-tiempo-real
```

2. Instala las dependencias
3. Configura Firebase en tu archivo .env:
    VITE_FIREBASE_API_KEY=tu_api_key
    VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
    VITE_FIREBASE_DATABASE_URL=tu_database_url
    VITE_FIREBASE_PROJECT_ID=tu_project_id
    VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
    VITE_FIREBASE_APP_ID=tu_app_id
    VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id

4. Ejecuta el proyecto