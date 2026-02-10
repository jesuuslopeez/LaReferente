# Justificación DIW

## Arquitectura: ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components? ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?

Las variables las he puesto en Settings porque es la primera capa de ITCSS, que es donde van las configuraciones globales como son las variables. Al estar lo primero tiene la especificidad más baja y se aplica a todo lo demás.

Los estilos del listado los he puesto en Components porque es donde van los estilos concretos de cada componente, que ya tienen una especificidad más alta y usan las variables que han sido definidas arriba.

Si importase Components antes que Settings en el styles.scss, las variables no harían nada porque actuaría como si no estuviesen definidas aún.

## Metodología: Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).

Lo que hace que BEM es que no haya conflictos, ademas de la mayor facilidad que dan para identificarse.

Si hubiese usado selectores anidados como section > article la especificidad sube y si en otro sitio quiero darle otro estilo a un article dentro de un section tendría problemas porque se pisarían entre ellos.