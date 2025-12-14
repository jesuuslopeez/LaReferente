# Docker Setup - La Referente

## Desarrollo

### Arrancar el proyecto en modo desarrollo:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Esto levanta:
- **PostgreSQL** en `localhost:5432`
- **Backend** en `localhost:8080`

### Ver logs:
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### Parar todo:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Parar y eliminar volúmenes (borra la BD):
```bash
docker-compose -f docker-compose.dev.yml down -v
```

---

## Producción

### 1. Crear archivo `.env` con tus credenciales:

```bash
cp .env.example .env
```

Edita `.env` y cambia las contraseñas y secretos.

### 2. Arrancar en producción:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

El flag `-d` lo ejecuta en segundo plano (detached).

### 3. Ver logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f backend
```

### 4. Parar:
```bash
docker-compose -f docker-compose.prod.yml down
```

---

## Endpoints disponibles

Una vez arrancado:

- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Actuator Health**: http://localhost:8080/actuator/health

---

## Comandos útiles

### Reconstruir solo el backend:
```bash
docker-compose -f docker-compose.dev.yml up --build backend
```

### Ejecutar comandos dentro del contenedor de PostgreSQL:
```bash
docker exec -it lareferente-postgres-dev psql -U postgres -d lareferente
```

### Ver estado de los contenedores:
```bash
docker-compose -f docker-compose.dev.yml ps
```
