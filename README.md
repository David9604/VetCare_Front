# VetCare
Front de AppWeb para la gestion de una veterinaria

### Features

- **Gestión de Pacientes**: Registrar y administrar mascotas con información detallada
- **Historial Médico**: Mantener registro de consultas y tratamientos
- **Citas y Turnos**: Sistema de reserva de citas para veterinario
- **Gestión de Usuarios**: Control de acceso para administradores, veterinarios y clientes
- **Reportes**: Generar reportes de actividades y pacientes
- **Interfaz Responsiva**: Diseño adaptable a dispositivos móviles y desktop

### Requisitos

- **Node.js** versión 14 o superior
- **npm** versión 6 o superior
- **Git** para clonar el repositorio
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Pasos para correr el frontend
#### 1. Clonar el repositorio
   ```bash
      git clone https://github.com/David9604/VetCare_Front.git
   ```
#### 2. Navega al directorio del proyecto:
   ```bash
      cd vetcare_front
   ```
#### 3. Instala las dependencias:
   ```bash
      npm install
   ```
#### 4. Inicia el servidor de desarrollo:
   ```bash
      npm run dev
   ```
### Variables de entorno

El frontend usa Vite y carga variables según el modo.

Crear archivo `.env.production` (ya agregado) con:
```bash
VITE_API_URL=https://api.vetcareservices.online/api
```

Opcional para desarrollo local (`.env.development`):
```bash
VITE_API_URL=/api
```
Esto permite que el proxy definido en `vite.config.js` redirija a `http://localhost:8080`.

### Build para producción

```bash
npm run build
```
Genera archivos estáticos en `dist/`. Servirlos con cualquier servidor estático (Nginx, Apache, etc.). Si se despliega en un hosting separado del backend, asegúrate de:
- Habilitar CORS con credenciales en el backend (`Access-Control-Allow-Credentials: true`).
- Permitir origen del dominio donde se sirve el frontend (`Access-Control-Allow-Origin`).
- Usar HTTPS consistente para que las cookies de sesión se envíen correctamente.

### Preview local del build
```bash
npm run preview
```