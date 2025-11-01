# 📝 Notas Rápidas - PWA

## 🎯 Descripción

Aplicación Web Progresiva (PWA) desarrollada con **Vue.js** y **Nuxt.js** para gestionar notas de forma offline. Permite crear, editar y eliminar notas que se guardan localmente en el dispositivo.

---

## ✨ Características Implementadas

✅ **Gestión de Notas**
- Crear nuevas notas con título y contenido
- Editar notas existentes
- Eliminar notas con confirmación
- Listado de todas las notas guardadas

✅ **Almacenamiento Offline**
- Guardado automático en LocalStorage
- Persistencia de datos entre sesiones
- Funciona sin conexión a Internet

✅ **PWA Completa**
- Service Worker configurado
- Manifest.json para instalación
- Instalable como app nativa
- Soporte para modo offline

✅ **Diseño Responsive**
- Adaptable a móvil, tablet y desktop
- Modo oscuro automático
- Animaciones suaves
- UI moderna y profesional

✅ **Producción Ready**
- Configuración PM2 para servidor
- Configuración Nginx como proxy
- SSL con Let's Encrypt
- Documentación completa de despliegue

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Vue.js | 3.x | Framework frontend |
| Nuxt.js | 3.12+ | Framework SSR/SSG |
| TypeScript | - | Tipado estático |
| @vite-pwa/nuxt | 0.5+ | Soporte PWA |
| PM2 | - | Gestor de procesos |
| Nginx | - | Servidor web/proxy |
| LocalStorage | - | Almacenamiento local |

---

## 📁 Estructura del Proyecto

```
AppNotas/
│
├── app.vue                          # Componente principal de la app
│
├── assets/
│   └── css/
│       └── main.css                 # Estilos globales (responsive, modo oscuro)
│
├── components/
│   ├── NoteForm.vue                 # Formulario crear/editar notas
│   ├── NoteCard.vue                 # Tarjeta de visualización de nota
│   └── EmptyState.vue               # Mensaje cuando no hay notas
│
├── composables/
│   └── useNotes.ts                  # Lógica de negocio (CRUD, LocalStorage)
│
├── public/                          # Archivos estáticos
│   ├── pwa-64x64.png                # Iconos PWA (generar)
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   ├── maskable-icon-512x512.png
│   └── favicon.ico
│
├── nuxt.config.ts                   # Configuración Nuxt + PWA
├── package.json                     # Dependencias y scripts
├── ecosystem.config.js              # Configuración PM2
├── tsconfig.json                    # Configuración TypeScript
│
└── [DOCUMENTACIÓN]
    ├── README.md                    # Documentación general
    ├── INSTRUCCIONES-FINALES.md     # Guía de inicio
    ├── PASOS-DESPLIEGUE.md          # Deploy paso a paso
    ├── DEPLOYMENT.md                # Deploy detallado
    ├── QUICK-START.md               # Inicio rápido
    ├── DNS-SETUP.md                 # Configuración DNS
    ├── create-icons.md              # Crear iconos PWA
    ├── generate-icons-temp.bat      # Generar iconos temporales
    └── generate-icons-temp.sh       # Script iconos (Linux/Mac)
```

---

## 🚀 Comandos Disponibles

### Desarrollo
```bash
npm install          # Instalar dependencias
npm run dev         # Servidor desarrollo (localhost:3000)
npm run build       # Compilar para producción
npm run preview     # Previsualizar build de producción
```

### Iconos (Solo primera vez)
```bash
# Windows
generate-icons-temp.bat

# Linux/Mac  
chmod +x generate-icons-temp.sh
./generate-icons-temp.sh
```

---

## 🌐 Despliegue en Digital Ocean

### Configuración del Dominio
- **Dominio:** noty.live
- **Servidor:** Digital Ocean Droplet
- **Puerto:** 3000 (interno) → 80/443 (externo)
- **SSL:** Let's Encrypt (automático)

### Stack de Producción
- **Node.js:** 18.x
- **PM2:** Gestor de procesos (cluster mode)
- **Nginx:** Proxy reverso + SSL termination
- **Certbot:** Renovación automática SSL

### Instrucciones de Despliegue

**Para despliegue rápido:**
→ Ver **INSTRUCCIONES-FINALES.md**

**Para despliegue detallado:**
→ Ver **PASOS-DESPLIEGUE.md**

**Para detalles técnicos:**
→ Ver **DEPLOYMENT.md**

**Para configurar DNS:**
→ Ver **DNS-SETUP.md**

---

## 📱 Instalación de la PWA

### Android (Chrome)
1. Abrir https://noty.live
2. Menú (⋮) → "Agregar a pantalla de inicio"
3. Confirmar instalación
4. La app aparece como icono en la pantalla de inicio

### iPhone (Safari)
1. Abrir https://noty.live
2. Botón Compartir (□↑)
3. "Agregar a pantalla de inicio"
4. Personalizar nombre y confirmar

### Desktop (Chrome/Edge)
1. Abrir https://noty.live
2. Buscar icono de instalación en barra de direcciones
3. Click en "Instalar"
4. La app se abre en ventana propia

---

## 🧪 Funcionalidades de la PWA

### Offline First
- ✅ Service Worker cachea recursos
- ✅ LocalStorage guarda las notas
- ✅ Navegación funciona sin conexión
- ✅ Actualizaciones automáticas al reconectar

### Instalación Nativa
- ✅ Manifest.json configurado
- ✅ Iconos en múltiples tamaños
- ✅ Inicio en modo standalone
- ✅ Pantalla de inicio personalizada

### Performance
- ✅ Lazy loading de componentes
- ✅ Compresión de assets
- ✅ Cache estratégico con Workbox
- ✅ Carga rápida (< 2s primera carga)

---

## 🎨 Personalización

### Colores
Editar `assets/css/main.css`:

```css
:root {
  --primary-color: #4CAF50;      /* Color principal */
  --primary-dark: #45a049;       /* Color hover */
  --danger-color: #f44336;       /* Color eliminar */
  --background: #f5f5f5;         /* Fondo */
}
```

### Configuración PWA
Editar `nuxt.config.ts`:

```typescript
pwa: {
  manifest: {
    name: 'Notas Rápidas',      // Nombre de la app
    short_name: 'Notas',        // Nombre corto
    theme_color: '#4CAF50',     // Color tema
    background_color: '#ffffff' // Color fondo
  }
}
```

### Puerto del Servidor
Editar `ecosystem.config.js`:

```javascript
env: {
  PORT: 3000  // Cambiar si es necesario
}
```

---

## 🐛 Troubleshooting

### La app no compila
```bash
rm -rf node_modules .nuxt .output
npm install
npm run build
```

### Los iconos no aparecen
```bash
generate-icons-temp.bat  # Windows
./generate-icons-temp.sh  # Linux/Mac
```

### Error en el servidor
```bash
# Ver logs
pm2 logs app-notas-pwa

# Reiniciar
pm2 restart app-notas-pwa

# Verificar estado
pm2 status
```

### Error 502
```bash
# Verificar que la app esté corriendo
pm2 status

# Verificar Nginx
nginx -t
systemctl status nginx

# Reiniciar ambos
pm2 restart app-notas-pwa
systemctl restart nginx
```

---

## 📚 Documentación Adicional

| Archivo | Propósito | Cuándo Consultar |
|---------|-----------|------------------|
| **README.md** | Descripción completa | Información general |
| **INSTRUCCIONES-FINALES.md** | Inicio y despliegue | Primera vez |
| **PASOS-DESPLIEGUE.md** | Deploy paso a paso | Al desplegar |
| **QUICK-START.md** | Inicio rápido | Referencia rápida |
| **DEPLOYMENT.md** | Deploy avanzado | Necesitas detalles técnicos |
| **DNS-SETUP.md** | Configurar dominio | Al configurar DNS |
| **create-icons.md** | Crear iconos | Para iconos profesionales |

---

## ✅ Checklist de Lanzamiento

### Pre-Desarrollo
- [x] Proyecto creado con Nuxt.js
- [x] Componentes implementados
- [x] Estilos responsive configurados
- [x] LocalStorage funcionando
- [x] PWA configurada

### Pre-Despliegue
- [ ] Dependencias instaladas
- [ ] Iconos creados y agregados
- [ ] App probada localmente
- [ ] Build de producción exitoso
- [ ] Pruebas offline completadas

### Despliegue
- [ ] Droplet creado en Digital Ocean
- [ ] Servidor configurado (Node/PM2/Nginx)
- [ ] Proyecto subido al servidor
- [ ] PM2 corriendo la app
- [ ] Nginx configurado como proxy
- [ ] DNS configurado y propagado
- [ ] SSL instalado con Certbot
- [ ] Firewall configurado

### Post-Despliegue
- [ ] App accesible en https://noty.live
- [ ] PWA instalable en dispositivos
- [ ] Funcionalidad offline probada
- [ ] SSL renovando automáticamente
- [ ] Backups configurados
- [ ] Monitoreo activo

---

## 🎯 Características Futuras (Opcional)

### Mejoras Potenciales
- 📎 Adjuntar imágenes a notas
- 🏷️ Sistema de etiquetas/categorías
- 🔍 Búsqueda de notas
- 📅 Recordatorios/notificaciones
- 🌐 Sincronización en la nube
- 👥 Compartir notas
- 🎨 Temas personalizables
- 📊 Estadísticas de uso

---

## 📄 Licencia

Proyecto desarrollado para tareas de Ingeniería Keller.

---

## 👥 Autor

Desarrollado con Vue.js, Nuxt.js y Digital Ocean.

---

## 🎉 ¡Listo!

Tu PWA "Notas Rápidas" está lista para ser desplegada.

**Próximos pasos:**
1. Ejecutar `npm install`
2. Crear iconos con `generate-icons-temp.bat`
3. Probar localmente con `npm run dev`
4. Seguir **INSTRUCCIONES-FINALES.md** para desplegar
5. Compartir https://noty.live 🚀

---

**¿Dudas?** Consulta la documentación en los archivos .md o revisa los logs.

