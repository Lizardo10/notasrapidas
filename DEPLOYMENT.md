# 🚀 Guía de Despliegue en Digital Ocean

Esta guía te ayudará a desplegar la aplicación PWA "Notas Rápidas" en un Droplet de Digital Ocean con el dominio **noty.live**.

## 📋 Prerrequisitos

1. Un Droplet de Digital Ocean con Ubuntu 22.04
2. Un dominio apuntando a la IP del Droplet (noty.live)
3. Acceso SSH al servidor

---

## 🔧 Configuración del Servidor

### Paso 1: Conectarse y Actualizar el Servidor

```bash
ssh root@TU_IP_DROPLET
```

```bash
# Actualizar el sistema
apt update && apt upgrade -y
```

### Paso 2: Instalar Node.js 18

```bash
# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### Paso 3: Instalar PM2

```bash
npm install -g pm2

# Verificar instalación
pm2 --version
```

### Paso 4: Instalar Nginx

```bash
apt install -y nginx

# Iniciar y habilitar Nginx
systemctl start nginx
systemctl enable nginx

# Verificar estado
systemctl status nginx
```

---

## 📦 Subir el Proyecto

### Opción A: Usando Git (Recomendado)

```bash
# En el servidor
cd /var/www
mkdir app-notas
cd app-notas

# Si tienes el proyecto en GitHub/GitLab
git clone TU_REPOSITORIO .

# O clona tu repositorio localmente primero y luego sube
```

### Opción B: Usando SCP

```bash
# En tu máquina local, compilar primero
npm run build

# Crear archivo comprimido con archivos necesarios
tar -czf deploy.tar.gz \
  .nuxt \
  .output \
  package.json \
  package-lock.json \
  nuxt.config.ts \
  tsconfig.json \
  ecosystem.config.js \
  public \
  assets \
  components \
  composables \
  app.vue

# Subir al servidor
scp deploy.tar.gz root@TU_IP_DROPLET:/var/www/
```

```bash
# En el servidor
cd /var/www
mkdir app-notas
cd app-notas
tar -xzf ../deploy.tar.gz

# O si subiste la carpeta completa
cd /var/www/app-notas

# Instalar dependencias
npm install --production
```

---

## ⚙️ Configurar PM2

```bash
# Crear directorio de logs
mkdir -p logs

# Iniciar la aplicación con PM2
pm2 start ecosystem.config.js

# Verificar que está corriendo
pm2 status
pm2 logs app-notas-pwa

# Guardar configuración de PM2
pm2 save

# Configurar PM2 para iniciar al arrancar el sistema
pm2 startup
# Copiar y ejecutar el comando que te muestra
```

---

## 🌐 Configurar Nginx

```bash
# Crear configuración de Nginx
nano /etc/nginx/sites-available/noty.live
```

Pega la siguiente configuración:

```nginx
server {
    listen 80;
    server_name noty.live www.noty.live;

    # Logs
    access_log /var/log/nginx/noty.live-access.log;
    error_log /var/log/nginx/noty.live-error.log;

    # Compresión
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Proxy a Nuxt
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache para manifest y service worker
    location ~* \.(manifest|json)$ {
        proxy_pass http://localhost:3000;
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
}
```

```bash
# Habilitar el sitio
ln -s /etc/nginx/sites-available/noty.live /etc/nginx/sites-enabled/

# Eliminar sitio por defecto si existe
rm /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

# Si todo está bien, reiniciar Nginx
systemctl restart nginx
```

---

## 🔒 Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
certbot --nginx -d noty.live -d www.noty.live

# Seguir las instrucciones:
# - Ingresar tu email
# - Aceptar términos de servicio
# - Elegir redirigir HTTP a HTTPS (opción 2)
```

El certificado se renovará automáticamente. Puedes verificar con:

```bash
certbot certificates
```

---

## 📱 Generar Iconos PWA

**IMPORTANTE**: Necesitas crear los iconos de la PWA antes de compilar.

```bash
# En tu máquina local, crear iconos con:
# - Tamaño: 64x64, 192x192, 512x512 px
# - Formato: PNG
# - Fondo transparente o sólido
# - Usar un logo de notas/memoria

# Puedes usar herramientas online como:
# - https://realfavicongenerator.net/
# - https://www.pwabuilder.com/imageGenerator

# O crear manualmente con ImageMagick o Photoshop

# Una vez creados, colócalos en public/:
# public/pwa-64x64.png
# public/pwa-192x192.png
# public/pwa-512x512.png
# public/maskable-icon-512x512.png
```

---

## 🔄 Actualizar la Aplicación

```bash
# En tu máquina local
npm run build
scp -r .nuxt .output root@TU_IP_DROPLET:/var/www/app-notas/

# En el servidor
cd /var/www/app-notas
pm2 restart app-notas-pwa
```

O si usas Git:

```bash
# En el servidor
cd /var/www/app-notas
git pull
npm install --production
npm run build
pm2 restart app-notas-pwa
```

---

## 🛠️ Comandos Útiles

### PM2

```bash
pm2 status                  # Ver estado de procesos
pm2 logs app-notas-pwa      # Ver logs en tiempo real
pm2 monit                   # Monitor interactivo
pm2 restart app-notas-pwa   # Reiniciar aplicación
pm2 stop app-notas-pwa      # Detener aplicación
pm2 delete app-notas-pwa    # Eliminar proceso
pm2 save                    # Guardar configuración actual
```

### Nginx

```bash
nginx -t                    # Verificar configuración
nginx -s reload             # Recargar configuración
systemctl restart nginx     # Reiniciar Nginx
systemctl status nginx      # Ver estado
tail -f /var/log/nginx/noty.live-error.log  # Ver errores
```

### Certbot

```bash
certbot renew               # Renovar certificados manualmente
certbot certificates        # Listar certificados
certbot --nginx -d noty.live --force-renewal  # Forzar renovación
```

### Sistema

```bash
df -h                       # Ver espacio en disco
free -h                     # Ver memoria RAM
top                         # Monitor de procesos
```

---

## 🐛 Solución de Problemas

### La aplicación no se inicia

```bash
# Ver logs detallados
pm2 logs app-notas-pwa --lines 100

# Verificar que el puerto esté libre
netstat -tulpn | grep 3000

# Revisar configuración de Nuxt
cat nuxt.config.ts
```

### Error 502 Bad Gateway

```bash
# Verificar que Nuxt esté corriendo
pm2 status

# Ver logs de Nginx
tail -f /var/log/nginx/error.log

# Verificar que el proxy esté configurado correctamente
grep -A 5 "proxy_pass" /etc/nginx/sites-available/noty.live
```

### Problemas con SSL

```bash
# Verificar certificados
certbot certificates

# Renovar certificado manualmente
certbot renew --force-renewal

# Ver logs de Certbot
tail -f /var/log/letsencrypt/letsencrypt.log
```

### Problemas de memoria

```bash
# Ver uso de memoria
free -h
pm2 monit

# Si necesitas más memoria, crear swap:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 🔐 Seguridad Adicional

### Configurar Firewall

```bash
# Instalar UFW
apt install -y ufw

# Permitir SSH, HTTP y HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'

# Activar firewall
ufw enable

# Ver estado
ufw status
```

### Configurar Auto-backups

```bash
# Instalar herramientas de backup
apt install -y rsync

# Crear script de backup diario
nano /root/backup-app-notas.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
SOURCE_DIR="/var/www/app-notas"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/app-notas-$DATE.tar.gz $SOURCE_DIR

# Mantener solo los últimos 7 días
find $BACKUP_DIR -name "app-notas-*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x /root/backup-app-notas.sh

# Agregar a crontab
crontab -e

# Agregar línea (ejecutar diariamente a las 3 AM):
0 3 * * * /root/backup-app-notas.sh
```

---

## ✅ Checklist Final

- [ ] Node.js 18 instalado
- [ ] PM2 instalado y configurado
- [ ] Nginx instalado y configurado
- [ ] SSL configurado con Let's Encrypt
- [ ] Firewall configurado
- [ ] Aplicación corriendo en PM2
- [ ] Dominio apuntando correctamente
- [ ] SSL renovando automáticamente
- [ ] Logs funcionando
- [ ] Backup configurado

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `pm2 logs` y `/var/log/nginx/error.log`
2. Verifica la configuración de DNS
3. Asegúrate de que los puertos estén abiertos
4. Comprueba que Node.js y PM2 estén correctamente instalados

---

## 🎉 ¡Listo!

Tu aplicación PWA "Notas Rápidas" debería estar disponible en **https://noty.live**

Los usuarios podrán:
- Acceder desde el navegador
- Instalarla como app nativa en sus dispositivos
- Usarla completamente offline

¡Felicitaciones! 🚀

