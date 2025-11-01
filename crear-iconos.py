#!/usr/bin/env python3
"""
Script simple para crear iconos PWA temporales usando solo Python estándar
"""
import base64
import os

def crear_directorio():
    """Crear directorio public si no existe"""
    os.makedirs('public', exist_ok=True)

def crear_icono_png_simple(size, filename):
    """Crear un PNG simple con color sólido usando base64"""
    # PNG mínimo con color #2563eb (azul profesional)
    # Este es un PNG de 1x1 pixel que PNG válido más simple
    png_data = {
        64: b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00@\x00\x00\x00@\x08\x06\x00\x00\x00\xaaiq\xde\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\xc9e<\x00\x00\x00\x0eIDATx\xdac\xf8\x0f\x00\x00\x01\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82',
        192: b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\xc0\x00\x00\x00\xc0\x08\x06\x00\x00\x00\xadX\xa9\xf2\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\xc9e<\x00\x00\x00\x0eIDATx\xdac\xf8\x0f\x00\x00\x01\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82',
        512: b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x02\x00\x00\x00\x02\x00\x08\x06\x00\x00\x00\xf4tW\xfa\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\xc9e<\x00\x00\x00\x0eIDATx\xdac\xf8\x0f\x00\x00\x01\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82',
        32: b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \x08\x06\x00\x00\x00szz\xf4\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\xc9e<\x00\x00\x00\x0eIDATx\xdac\xf8\x0f\x00\x00\x01\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    }
    
    if size in png_data:
        with open(filename, 'wb') as f:
            f.write(png_data[size])
        print(f"✓ Creado: {filename}")

def main():
    print("🎨 Creando iconos PWA temporales...")
    
    crear_directorio()
    
    # Crear iconos
    crear_icono_png_simple(64, 'public/pwa-64x64.png')
    crear_icono_png_simple(192, 'public/pwa-192x192.png')
    crear_icono_png_simple(512, 'public/pwa-512x512.png')
    crear_icono_png_simple(512, 'public/maskable-icon-512x512.png')
    crear_icono_png_simple(32, 'public/favicon.ico')
    
    print("\n✅ ¡Iconos creados exitosamente!")
    print("⚠️  Estos son iconos temporales simples.")
    print("   Para producción, crea iconos profesionales siguiendo create-icons.md")

if __name__ == '__main__':
    main()

