# Justificación DWEC

He creado la página Ciudades y dentro de ella he metido dos componentes con relación padre hijo para mostrar datos del backend (como es un jugador de la base de datos).

El componente contenedor (BackendInfoContainer) es el padre, que se encarga de inyectar el servicio de jugadores y llamar al backend para traerse un jugador por su id. Con if y else se gestiona la carga o la no carga mostrando un mensaje de mientras espera la respuesta y un mensaje de error si no encuentra al jugador.

El componente que presenta (BackendInfoPresent) es el hijo, es standalone y recibe la información del jugador a través de un @Input. Se limita a poner los datos como nombre, posición, edad y nacionalidad y si está activo o no.

La ruta de ciudades usa loadComponent() en vez de importar el componente directamente, así solo se carga cuando el usuario navega a esa página.

## Información consultada
- Documentación oficial de Angular (https://angular.dev/guide/components)
- Fragmentos de mi propio código :)