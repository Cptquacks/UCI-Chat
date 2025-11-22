# UChat - Sistema de Chat con Arquitectura MVC

## Proyecto de Tesis - Universidad de las Ciencias Informáticas (UCI)

Sistema de mensajería en tiempo real desarrollado con Node.js, Express y Socket.io, implementando una arquitectura MVC escalable con autenticación basada en sesiones.

---

## Características Técnicas

### Stack Tecnológico
- **Backend**: Node.js + Express.js + Socket.io
- **Base de datos**: SQLite con Prisma ORM
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Autenticación**: Express-session con middleware personalizado
- **Arquitectura**: MVC con separación clara de responsabilidades

---

## Funcionalidades Implementadas

### Sistema de Autenticación
- Registro de usuarios con validación de email y hash de contraseñas
- Login con sesiones persistentes y auto-reconexión
- Middleware para protección de rutas
- Gestión segura de sesiones

### Comunicación en Tiempo Real
- Servidor Socket.io integrado con autenticación de sesiones
- Mapa de usuarios conectados en tiempo real
- Middleware de autenticación para WebSockets
- Eventos de conexión/desconexión

### Gestión de Datos
- Schema Prisma con relaciones User-Message-Group
- Migraciones versionadas para control de cambios
- Operaciones CRUD mediante Prisma Client
- Validación de datos en servidor y cliente

### Interfaz de Usuario
- Vistas HTML modularizadas (login, registro, perfil, chat)
- Scripts JavaScript especializados por funcionalidad
- Sistema de estilos CSS con variables CSS personalizadas
- Diseño responsive con componentes reutilizables

---

## Requisitos del Sistema

### Prerrequisitos
- Node.js 16.0 o superior
- SQLite3
- Navegador web con soporte para ES6+

### Compatibilidad
**Importante**: Este proyecto fue desarrollado en Linux. Pueden existir incompatibilidades con Windows debido a:
- Rutas de archivos (`/` vs `\`)
- Variables de entorno del sistema
- Ejecución de scripts de shell
- Permisos de sistema de archivos

### Instalación
```bash
# Clonar repositorio
git clone [<repository-url>](https://github.com/Cptquacks/UCI-Chat.git)

# Instalar dependencias
npm install

# Ejecutar migraciones de base de datos
npx prisma migrate deploy

# Iniciar servidor de desarrollo
npm run dev
```

---

**Desarrollado como proyecto de tesis en la Universidad de las Ciencias Informáticas (UCI)**  
*Documentación técnica actualizada: Octubre 2024*
