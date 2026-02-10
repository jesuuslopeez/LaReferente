# Justificación DIW
## Arquitectura: ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components? ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?
Principalmente por la especificidad, cada cosa debe ir en su capa correspondiente para no tener problemas y poder hacer uso de ciertas cosas anteriores. Lo que ocurriría si tuviesemos Components antes que Settings sería que no podriamos hacer uso de las variables globales por orden de especificidad y por los principios ITCSS.

## Metodología: Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).
La facilidad para leer e identificar los selectores, ya que estando anidados cuesta más trabajar con ellos porque tienes que ir buscando dentro de un mismo item, mientras que con BEM simplemente toca fijarse en su nombre, que es más descriptivo que el anidamiento haciendo más sencillo el trabajo con ellos.