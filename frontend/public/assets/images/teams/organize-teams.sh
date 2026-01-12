#!/bin/bash

# Script para organizar imágenes de equipos por tamaño
# Uso: ./organize-teams.sh
#
# Mueve archivos con sufijo -small, -medium, -large a sus carpetas correspondientes
# y les quita el sufijo del nombre.
#
# Ejemplo:
#   fc-barcelona-small.png  →  small/fc-barcelona.png
#   fc-barcelona-medium.png →  medium/fc-barcelona.png
#   fc-barcelona-large.png  →  large/fc-barcelona.png

echo "🔄 Organizando imágenes de equipos..."

# Crear carpetas si no existen
mkdir -p small medium large

# Contador de archivos movidos
count_small=0
count_medium=0
count_large=0

# Mover archivos -small
for file in *-small.*; do
  if [ -f "$file" ]; then
    newname="${file/-small/}"
    mv "$file" "small/$newname"
    echo "  ✓ $file → small/$newname"
    ((count_small++))
  fi
done

# Mover archivos -medium
for file in *-medium.*; do
  if [ -f "$file" ]; then
    newname="${file/-medium/}"
    mv "$file" "medium/$newname"
    echo "  ✓ $file → medium/$newname"
    ((count_medium++))
  fi
done

# Mover archivos -large
for file in *-large.*; do
  if [ -f "$file" ]; then
    newname="${file/-large/}"
    mv "$file" "large/$newname"
    echo "  ✓ $file → large/$newname"
    ((count_large++))
  fi
done

echo ""
echo "✅ Organización completada:"
echo "   - Small:  $count_small archivos"
echo "   - Medium: $count_medium archivos"
echo "   - Large:  $count_large archivos"
echo "   - Total:  $((count_small + count_medium + count_large)) archivos movidos"
