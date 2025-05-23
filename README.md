﻿# Sistema de Egresados UNIMAR 🎓

## Descripción General
Sistema web para la gestión y seguimiento de egresados de la Universidad Mariana. Permite a los egresados crear perfiles profesionales, compartir su ubicación, experiencia laboral y mantener conexión con la comunidad universitaria.

## Funcionalidades Principales

### 🔐 Autenticación y Registro
- Registro de nuevos usuarios con validación de datos
- Inicio de sesión seguro
- Gestión de perfiles de usuario

### 👤 Perfiles de Egresados
- Creación y edición de perfiles profesionales
- Gestión de información personal
- Registro de formación académica
- Registro de experiencia laboral
- Gestión de habilidades técnicas y blandas

### 📍 Mapa de Egresados
- Visualización geográfica de la ubicación de egresados
- Marcadores interactivos con información del egresado
- Vista personalizada del mapa con OpenStreetMap

### 🔍 Búsqueda y Filtrado
- Búsqueda por nombre o identificación
- Filtros por experiencia y formación
- Filtrado por habilidades específicas

## Tecnologías Utilizadas

### Frontend
- React.js con TypeScript
- Tailwind CSS para estilos
- Lucide React para iconos
- Leaflet para mapas interactivos

### Backend
- Laravel (PHP)
- MySQL para base de datos
- API RESTful

### Componentes UI
- Shadcn UI
- Componentes personalizados

## Requisitos de Instalación

### Requisitos Previos
- PHP >= 8.0
- Node.js >= 16.0
- Composer
- MySQL

### Dependencias Principales
```json
{
  "dependencies": {
    "@inertiajs/react": "^1.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "leaflet": "^1.9.0",
    "lucide-react": "^0.x.x",
    "tailwindcss": "^3.x.x"
  }
}
```

## Instalación y Configuración

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/Felipey55/SistemaEgresados.git
   cd SistemaEgresados
   ```

2. **Instalar Dependencias de PHP**
   ```bash
   composer install
   ```

3. **Instalar Dependencias de Node.js**
   ```bash
   npm install
   ```

4. **Configurar el Entorno**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configurar la Base de Datos**
   - Crear base de datos MySQL
   - Actualizar credenciales en .env
   ```bash
   php artisan migrate
   ```

6. **Compilar Assets**
   ```bash
   npm run dev
   ```

7. **Iniciar el Servidor**
   ```bash
   php artisan serve
   ```

## Estructura del Proyecto

```
SistemaEgresados/
├── app/                 # Lógica de la aplicación
├── resources/
│   ├── js/             # Componentes React
│   │   ├── pages/      # Páginas de la aplicación
│   │   └── components/ # Componentes reutilizables
│   └── views/          # Vistas blade
├── routes/             # Definición de rutas
├── database/          # Migraciones y seeders
└── public/            # Archivos públicos
```

## Contribución
1. Crear un fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Autoría
Desarrollado por el equipo de desarrollo de la Universidad Mariana

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
