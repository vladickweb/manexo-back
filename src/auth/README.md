# Módulo de Autenticación

Este módulo maneja toda la lógica de autenticación de la aplicación, incluyendo registro, login, autenticación con Google y gestión de tokens JWT.

## Endpoints Disponibles

### 1. Registro de Usuario
- **POST** `/auth/register`
- **Descripción**: Crea una nueva cuenta de usuario
- **Body**: `RegisterDto` (email, password, firstName, lastName)
- **Respuesta**: `AuthResponseDto` con tokens y datos del usuario

### 2. Inicio de Sesión
- **POST** `/auth/login`
- **Descripción**: Autentica un usuario existente
- **Body**: `LoginDto` (email, password)
- **Respuesta**: `AuthResponseDto` con tokens y datos del usuario

### 3. Renovación de Token
- **POST** `/auth/refresh`
- **Descripción**: Genera nuevos tokens usando un refresh token
- **Body**: `RefreshTokenDto` (refreshToken)
- **Respuesta**: `AuthResponseDto` con nuevos tokens

### 4. Obtener Perfil
- **GET** `/auth/me`
- **Descripción**: Obtiene el perfil del usuario autenticado
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta**: `UserProfileDto` con datos del usuario

### 5. Autenticación con Google
- **GET** `/auth/google`
- **Descripción**: Inicia el flujo de autenticación con Google
- **Respuesta**: Redirección a Google OAuth

### 6. Callback de Google
- **GET** `/auth/google/callback`
- **Descripción**: Maneja la respuesta de Google OAuth
- **Respuesta**: Redirección al frontend con tokens

## DTOs

### RegisterDto
```typescript
{
  email: string;        // Email del usuario
  password: string;     // Contraseña (mínimo 6 caracteres)
  firstName: string;    // Nombre del usuario
  lastName: string;     // Apellido del usuario
}
```

### LoginDto
```typescript
{
  email: string;        // Email del usuario
  password: string;     // Contraseña del usuario
}
```

### RefreshTokenDto
```typescript
{
  refreshToken: string; // Token de refresco JWT
}
```

### AuthResponseDto
```typescript
{
  accessToken: string;  // Token de acceso JWT
  refreshToken: string; // Token de refresco JWT
  user: any;           // Datos del usuario
}
```

### UserProfileDto
```typescript
{
  id: number;          // ID del usuario
  email: string;       // Email del usuario
  firstName: string;   // Nombre del usuario
  lastName: string;    // Apellido del usuario
  createdAt: Date;     // Fecha de creación
}
```

## Códigos de Respuesta

- **200**: Operación exitosa
- **201**: Usuario creado exitosamente
- **302**: Redirección (Google OAuth)
- **400**: Datos de entrada inválidos
- **401**: No autorizado (credenciales inválidas, token expirado)

## Autenticación

El módulo utiliza JWT (JSON Web Tokens) para la autenticación:

1. **Access Token**: Token de corta duración para acceder a recursos protegidos
2. **Refresh Token**: Token de larga duración para renovar el access token

Para acceder a endpoints protegidos, incluye el header:
```
Authorization: Bearer <access_token>
```

## Documentación Swagger

La documentación completa está disponible en Swagger UI cuando la aplicación esté ejecutándose:
- **URL**: `http://localhost:3000/api` (o la URL configurada)
- **Tag**: "Autenticación"

## Configuración

El módulo requiere las siguientes variables de entorno:

```env
# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:3001
``` 