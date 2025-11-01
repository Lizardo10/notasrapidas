@echo off
echo Creando iconos temporales para desarrollo...
echo.
echo IMPORTANTE: Necesitas ImageMagick instalado
echo Descarga desde: https://imagemagick.org/script/download.php
echo.
pause

if not exist "public" mkdir public

echo Generando iconos...
magick -size 64x64 xc:'#4CAF50' -gravity center -pointsize 48 -annotate +0+0 "📝" public\pwa-64x64.png
magick -size 192x192 xc:'#4CAF50' -gravity center -pointsize 144 -annotate +0+0 "📝" public\pwa-192x192.png
magick -size 512x512 xc:'#4CAF50' -gravity center -pointsize 384 -annotate +0+0 "📝" public\pwa-512x512.png
magick -size 512x512 xc:'#4CAF50' -gravity center -pointsize 384 -annotate +0+0 "📝" public\maskable-icon-512x512.png
magick -size 32x32 xc:'#4CAF50' -gravity center -pointsize 24 -annotate +0+0 "📝" public\favicon.ico

echo.
echo ¡Iconos creados exitosamente!
echo.
pause

