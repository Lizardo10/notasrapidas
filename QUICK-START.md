# 🚀 Inicio Rápido

Guía rápida para poner en marcha tu PWA "Notas Rápidas" localmente y en producción.

---

## 🏠 Desarrollo Local

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Generar Iconos

**Opción A: Usar script temporal** (solo para desarrollo)

```bash
# Si tienes ImageMagick instalado
chmod +x generate-icons-temp.sh
./generate-icons-temp.sh
```

**Opción B: Crear iconos profesionales**

Consulta `create-icons.md` para opciones detalladas de creación de iconos.

### 3. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

---

## 🌐 Desplegar en Digital Ocean

### Paso 1: Preparar el Droplet

```bash
# Conectarte al servidor
ssh root@TU_IP_DROPLET

# Configurar servidor (ejecutar estos comandos en el Droplet)
bash <(curl -s https://raw.githubusercontent.com/nodesource/distributions/master/deb/setup_18.x) && apt install -y nodejs nginx
npm install -g pm2
apt install -y certbot python3-certbot-nginx
```

### Paso 2: Subir el Proyecto

**Opción A: Usando Git**

```bash
# En tu máquina local
git add .
git commit -m "Versión lista para producción"
git push

# En el servidor
cd /var/www
git clone TU_REPOSITORIO app-notas
cd app-notas
npm install --production
```

**Opción B: Usando SCP**

```bash
# En tu máquina local, compilar primero
npm run build

# Comprimir archivos necesarios
tar -czf deploy.tar.gz .nuxt .output package*.json nuxt.config.ts tsconfig.json ecosystem.config.js public assets components composables app.vue

# Subir al servidor
scp deploy.tar.gz root@TU_IP_DROPLET:/var/www/
```

```bash
# En el servidor
cd /var/www
mkdir app-notas && cd app-notas
tar -xzf ../deploy.tar.gz
npm install --production
```

### Paso 3: Configurar PM2

```bash
# En el servidor
cd /var/www/app-notas
mkdir -p logs
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Paso 4: Configurar Nginx

```bash
# En el servidor
cat > /etc/nginx/sites-available/noty.live << 'EOF'
server {
    listen 80;
    server_name noty.live www.noty.live;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/noty.live /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### Paso 5: Configurar DNS

Consulta `DNS-SETUP.md` para configurar el DNS de noty.live.

### Paso 6: Configurar SSL

```bash
# En el servidor (después de que DNS esté propagado)
certbot --nginx -d noty.live -d www.noty.live
```

---

## 📱 Instalación PWA

Una vez desplegada, los usuarios pueden instalar la app:

### Android (Chrome)
1. Abrir https://noty.live
2. Menú → "Agregar a pantalla de inicio"

### iPhone (Safari)
1. Abrir https://noty.live
2. Compartir → "Agregar a pantalla de inicio"

### Desktop (Chrome/Edge)
1. Abrir https://noty.live
2. Click en el icono de instalación en la barra de direcciones

---

## 🔄 Actualizar la Aplicación

```bash
# En tu máquina local
npm run build

# Subir cambios
scp -r .nuxt .output root@TU_IP_DROPLET:/var/www/app-notas/

# En el servidor
pm2 restart app-notas-pwa
```

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Previsualizar producción
```

### Producción (en el servidor)
```bash
pm2 status           # Ver estado
pm2 logs             # Ver logs
pm2 restart app-notas-pwa  # Reiniciar
pm2 monit            # Monitor en tiempo real
```

### Nginx
```bash
nginx -t             # Verificar configuración
systemctl restart nginx  # Reiniciar
tail -f /var/log/nginx/error.log  # Ver errores
```

---

## 🐛 Solución de Problemas Rápida

| Problema | Solución |
|----------|----------|
| No se ven los iconos | Ejecutar `generate-icons-temp.sh` o crear iconos según `create-icons.md` |
| Error 502 | Verificar que PM2 esté corriendo: `pm2 status` |
| SSL no funciona | Verificar DNS y ejecutar: `certbot renew` |
| Puerto ocupado | Cambiar PORT en `ecosystem.config.js` |
| Cambios no se ven | Reiniciar PM2 y limpiar caché del navegador |

---

## 📚 Documentación Completa

- **README.md** - Descripción general del proyecto
- **DEPLOYMENT.md** - Guía detallada de despliegue
- **DNS-SETUP.md** - Configuración DNS paso a paso
- **create-icons.md** - Cómo crear iconos profesionales

---

## ✅ Checklist para Producción

Antes de desplegar:

- [ ] Los iconos están creados y son profesionales
- [ ] La aplicación funciona correctamente en desarrollo
- [ ] El dominio DNS está configurado
- [ ] El servidor tiene Node.js 18+ instalado
- [ ] PM2 y Nginx están configurados
- [ ] SSL está instalado y renovando automáticamente
- [ ] Firewall está configurado
- [ ] Backups están configurados

---

## 🎉 ¡Listo!

Tu PWA "Notas Rápidas" está funcionando y disponible en https://noty.live

¿Tienes preguntas? Consulta los otros archivos de documentación o revisa los logs en el servidor.

