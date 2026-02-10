# Justificación DWES

## Endpoint creado
He creado el endpoint GET /api/spanish/players que devuelve la lista de jugadores filtrados por la nacionalidad española. Lo he hecho porque en un futuro quiero implementar un sistema de convocatorias para selecciones nacionales y esto ya nos filtra a todos los jugadores.

## Arquitectura
He seguido la separación de capas que se indicaba en la tarea:
- SpanishController: recibe la petición y devuelve la respuesta
- SpanishService: tiene la lógica, convierte a DTO 
- SpanishRepository: hace la consulta a la base de datos con findByNacionalidadAndActivoTrue

## Seguridad
El endpoint está protegido con JWT. Para acceder necesitas estar autenticado (admin o editor), sin tienes token te devuelve un 403.

## Cómo probarlo
Primero hay que loguerse para obtener el token:

POST http://localhost:8080/api/auth/login
Body:
{
  "email": "admin@lapreferente.com",
  "password": "admin123"
}

Y luego usar el token en la petición:

GET http://localhost:8080/api/spanish/players
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbkBsYXJlZmVyZW50ZS5jb20iLCJpYXQiOjE3NzA3NDI2NzEsImV4cCI6MTc3MDgyOTA3MX0.ZwzbJGH4fpIzeMcnNu5bQat_NVs23fEhb-mENHFYIvs   

Sin token devuelve 403 Forbidden. Si es valido devuelve 200 OK y los jugadores correspondientes.