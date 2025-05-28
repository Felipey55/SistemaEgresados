
# Sistema de Gestión de Biblioteca Maridiaz 📚

## Descripción General
Sistema web para la gestión y administración de la biblioteca Maridiaz. Permite gestionar libros, lectores, préstamos y devoluciones de manera eficiente, facilitando el control y seguimiento del material bibliográfico.

## Funcionalidades Principales

### 🔐 Autenticación y Gestión de Usuarios
- Registro e inicio de sesión seguro
- Gestión de roles y permisos
- Panel de administración personalizado

### 📚 Gestión de Libros
- Registro y actualización de libros
- Catalogación por sistema Dewey
- Control de ejemplares
- Gestión de autores y editoriales
- Organización por estanterías y secciones

### 👥 Gestión de Lectores
- Registro de lectores por grados
- Historial de préstamos
- Estado y seguimiento de préstamos activos
- Gestión de sanciones y restricciones

### 📋 Préstamos y Devoluciones
- Sistema de préstamos y renovaciones
- Control de fechas de vencimiento
- Notificaciones de devolución
- Registro histórico de movimientos

### 🔍 Búsqueda y Filtrado
- Búsqueda avanzada de libros
- Filtros por categorías Dewey
- Búsqueda de lectores por grado
- Reportes y estadísticas

## Tecnologías Utilizadas

### Frontend
- React.js con TypeScript
- Tailwind CSS para estilos
- Lucide React para iconos
- Shadcn UI para componentes

### Backend
- Laravel (PHP)
- MySQL para base de datos
- API RESTful

### Herramientas de Desarrollo
- Vite.js
- ESLint
- Prettier
- PHP CS Fixer

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
    "lucide-react": "^0.x.x",
    "tailwindcss": "^3.x.x"
  }
}
```

## Instalación y Configuración

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/yourusername/gestionBibliotecaMaridiaz.git
   cd gestionBibliotecaMaridiaz
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
gestionBibliotecaMaridiaz/
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
Desarrollado por el equipo de desarrollo de la Biblioteca Maridiaz

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
