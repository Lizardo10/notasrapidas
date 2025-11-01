#!/bin/bash
# Script para generar iconos temporales usando ImageMagick
# NOTA: Estos son iconos temporales. Reemplázalos con iconos profesionales antes de producción.

echo "🎨 Generando iconos temporales para desarrollo..."

# Verificar si ImageMagick está instalado
if ! command -v magick &> /dev/null; then
    echo "❌ ImageMagick no está instalado."
    echo "Por favor instálalo o usa otra opción de create-icons.md"
    exit 1
fi

# Crear directorio public si no existe
mkdir -p public

# Generar iconos con emoji de nota
magick -size 64x64 xc:'#4CAF50' -gravity center -font Arial -pointsize 48 -annotate +0+0 '📝' public/pwa-64x64.png
magick -size 192x192 xc:'#4CAF50' -gravity center -font Arial -pointsize 144 -annotate +0+0 '📝' public/pwa-192x192.png
magick -size 512x512 xc:'#4CAF50' -gravity center -font Arial -pointsize 384 -annotate +0+0 '📝' public/pwa-512x512.png
magick -size 512x512 xc:'#4CAF50' -gravity center -font Arial -pointsize 384 -annotate +0+0 '📝' public/maskable-icon-512x512.png
magick -size 32x32 xc:'#4CAF50' -gravity center -font Arial -pointsize 24 -annotate +0+0 '📝' public/favicon.ico

echo "✅ Iconos temporales generados en public/"
echo "⚠️  Recuerda reemplazar estos iconos con diseños profesionales antes de producción"

