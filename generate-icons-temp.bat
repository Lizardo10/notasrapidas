@echo off
echo 🎨 Generando iconos temporales para desarrollo...
echo.
echo IMPORTANTE: Este script requiere ImageMagick instalado.
echo Descarga desde: https://imagemagick.org/script/download.php
echo.

REM Verificar si ImageMagick está instalado
magick -version >nul 2>&1
if errorlevel 1 (
    echo ❌ ImageMagick no está instalado.
    echo Por favor instálalo o consulta create-icons.md para otras opciones
    pause
    exit /b 1
)

REM Crear directorio public si no existe
if not exist "public" mkdir public

REM Generar iconos con emoji de nota
magick -size 64x64 xc:'#4CAF50' -gravity center -font Arial -pointsize 48 -annotate +0+0 '📝' public\pwa-64x64.png
magick -size 192x192 xc:'#4CAF50' -gravity center -font Arial -pointsize 144 -annotate +0+0 '📝' public\pwa-192x192.png
magick -size 512x512 xc:'#4CAF50' -gravity center -font Arial -pointsize 384 -annotate +0+0 '📝' public\pwa-512x512.png
magick -size 512x512 xc:'#4CAF50' -gravity center -font Arial -pointsize 384 -annotate +0+0 '📝' public\maskable-icon-512x512.png
magick -size 32x32 xc:'#4CAF50' -gravity center -font Arial -pointsize 24 -annotate +0+0 '📝' public\favicon.ico

echo.
echo ✅ Iconos temporales generados en public\
echo ⚠️  Recuerda reemplazar estos iconos con diseños profesionales antes de producción
echo.
pause

