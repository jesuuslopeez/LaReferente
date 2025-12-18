# Guía de Docker para La Referente

Este proyecto incluye configuraciones de Docker Compose para desarrollo y producción que levantan:
- Frontend (Angular 19)
- Backend (Spring Boot)
- Base de datos (PostgreSQL 16)

## Desarrollo

Para levantar el entorno de desarrollo con hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Servicios disponibles:
- **Frontend**: http://localhost:4200 (con hot-reload)
- **Backend**: http://localhost:8080
- **PostgreSQL**: localhost:5432

Para detener los servicios:

```bash
docker-compose -f docker-compose.dev.yml down
```

Para detener y eliminar volúmenes (elimina la base de datos):

```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Producción

Para levantar el entorno de producción:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

Servicios disponibles:
- **Frontend**: http://localhost (Nginx sirviendo build de producción)
- **Backend**: http://localhost/api (proxy inverso a través de Nginx)

Variables de entorno recomendadas (crear archivo `.env`):

```env
DB_USER=postgres
DB_PASSWORD=tu_password_seguro
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro
JWT_EXPIRATION=86400000
```

Para detener los servicios:

```bash
docker-compose -f docker-compose.prod.yml down
```

## Reconstruir solo un servicio

Frontend:
```bash
docker-compose -f docker-compose.dev.yml up --build frontend
```

Backend:
```bash
docker-compose -f docker-compose.dev.yml up --build backend
```

## Ver logs

Todos los servicios:
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

Solo un servicio:
```bash
docker-compose -f docker-compose.dev.yml logs -f frontend
```

## Acceso a contenedores

Frontend:
```bash
docker exec -it lareferente-frontend-dev sh
```

Backend:
```bash
docker exec -it lareferente-backend-dev sh
```

PostgreSQL:
```bash
docker exec -it lareferente-postgres-dev psql -U postgres -d lareferente
```

## Estructura de archivos Docker

```
.
├── docker-compose.dev.yml          # Configuración desarrollo
├── docker-compose.prod.yml         # Configuración producción
├── frontend/
│   ├── Dockerfile                  # Build producción (multi-stage con Nginx)
│   ├── Dockerfile.dev              # Build desarrollo (hot-reload)
│   ├── nginx.conf                  # Configuración Nginx para producción
│   └── .dockerignore              # Archivos ignorados en build
└── backend/
    ├── Dockerfile                  # Build Spring Boot
    └── .dockerignore              # Archivos ignorados en build
```

## Notas

- El frontend en desarrollo usa volúmenes para hot-reload automático
- El frontend en producción hace un build optimizado y se sirve con Nginx
- El backend comparte un volumen para los archivos subidos
- PostgreSQL usa volúmenes nombrados para persistencia de datos
- Todos los servicios están en la misma red Docker
