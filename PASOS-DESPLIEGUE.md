# 📋 Pasos para Desplegar en Digital Ocean

Esta es una guía simplificada paso a paso para subir tu PWA a Digital Ocean.

---

## 📝 Resumen Ejecutivo

**Configuración:**
- Dominio: **noty.live**
- Servidor: Digital Ocean Droplet (Ubuntu 22.04)
- Stack: Nuxt.js + PM2 + Nginx + SSL

---

## 🚀 PASO 1: Configurar el Servidor

### 1.1 Crear Droplet en Digital Ocean

1. Entra a tu cuenta de Digital Ocean
2. Click en **Create** → **Droplet**
3. Selecciona:
   - **Ubuntu 22.04 LTS**
   - Plan: **Basic** → **Regular** → **$12/mes** (o superior)
   - Región: La más cercana a tu audiencia
   - Authentication: SSH keys o Password
4. Crea el Droplet
5. **Guarda la IP del Droplet** 🎯

### 1.2 Configurar el Sistema

Conéctate al servidor:

```bash
ssh root@TU_IP_DROPLET
```

Ejecuta estos comandos para configurar el servidor:

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PM2
npm install -g pm2

# Instalar Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Instalar Certbot para SSL
apt install -y certbot python3-certbot-nginx

# Instalar Git (si vas a clonar el repositorio)
apt install -y git

# Verificar instalaciones
node --version
pm2 --version
nginx -v
```

---

## 🗂️ PASO 2: Subir el Proyecto

### Opción A: Usando Git (Recomendado)

**Primero en tu PC:**

```bash
# En tu directorio del proyecto
cd AppNotas

# Crear iconos temporales (si no los tienes)
# En Windows:
generate-icons-temp.bat

# Compilar el proyecto
npm run build

# Si no tienes git configurado:
git init
git add .
git commit -m "Versión inicial"
```

**Subir a GitHub (o tu repositorio):**

1. Crea un repositorio en GitHub
2. Sigue las instrucciones de GitHub para subir:

```bash
git remote add origin https://github.com/TU_USUARIO/app-notas-pwa.git
git branch -M main
git push -u origin main
```

**Luego en el servidor:**

```bash
cd /var/www

# Clonar repositorio
git clone https://github.com/TU_USUARIO/app-notas-pwa.git app-notas
cd app-notas

# Instalar dependencias
npm install --production
```

### Opción B: Usando SCP (Sin Git)

**En tu PC:**

```bash
# Compilar primero
npm run build

# Comprimir archivos
tar -czf deploy.tar.gz .nuxt .output package.json package-lock.json nuxt.config.ts tsconfig.json ecosystem.config.js public assets components composables app.vue

# Subir al servidor
scp deploy.tar.gz root@TU_IP_DROPLET:/var/www/
```

**En el servidor:**

```bash
cd /var/www
mkdir app-notas
cd app-notas
tar -xzf ../deploy.tar.gz
npm install --production
```

---

## ⚙️ PASO 3: Configurar PM2

```bash
# En el servidor, dentro de /var/www/app-notas
cd /var/www/app-notas

# Crear directorio de logs
mkdir -p logs

# Iniciar aplicación
pm2 start ecosystem.config.js

# Ver estado
pm2 status

# Configurar auto-inicio
pm2 startup
# Copia y ejecuta el comando que te muestra

# Guardar configuración
pm2 save

# Ver logs
pm2 logs app-notas-pwa
```

---

## 🌐 PASO 4: Configurar Nginx

```bash
# Crear configuración
nano /etc/nginx/sites-available/noty.live
```

Pega esta configuración:

```nginx
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Guarda (Ctrl+O, Enter, Ctrl+X)

```bash
# Habilitar sitio
ln -s /etc/nginx/sites-available/noty.live /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

---

## 📡 PASO 5: Configurar DNS

Consulta **DNS-SETUP.md** para instrucciones detalladas. Resumen:

### Si tienes Namecheap:

1. Inicia sesión en Namecheap
2. Ve a **Domain List** → **Manage** (noty.live)
3. **Advanced DNS** → Agrega estos registros:

```
Type: A Record
Host: @
Value: TU_IP_DROPLET
TTL: Automatic

Type: A Record  
Host: www
Value: TU_IP_DROPLET
TTL: Automatic
```

### Si usas Cloudflare:

1. Agrega el dominio en Cloudflare
2. Cambia los Name Servers en tu registrador
3. Agrega los registros A en Cloudflare

**IMPORTANTE:** Espera 1-24 horas a que se propague el DNS.

Verifica con:

```bash
ping noty.live
# Debe mostrar TU_IP_DROPLET
```

---

## 🔒 PASO 6: Configurar SSL

Una vez que el DNS esté propagado:

```bash
# En el servidor
ssh root@TU_IP_DROPLET

# Obtener certificado SSL
certbot --nginx -d noty.live -d www.noty.live

# Seguir instrucciones:
# - Email: ingresa tu email
# - Términos: presiona 'A'
# - Newsletter: 'N'
# - Redirigir HTTP a HTTPS: selecciona opción 2

# Verificar certificado
certbot certificates

# Probar renovación automática
certbot renew --dry-run
```

---

## 🧪 PASO 7: Verificar que Funciona

### 1. Abrir en el navegador

Abre: **https://noty.live**

### 2. Verificar logs

```bash
pm2 logs app-notas-pwa
```

### 3. Verificar estado de servicios

```bash
pm2 status
systemctl status nginx
```

### 4. Probar funcionalidad

- Crear una nota
- Editar una nota
- Eliminar una nota
- Instalar la PWA en tu dispositivo

---

## 🔄 Actualizar la Aplicación

Cada vez que hagas cambios:

**Si usas Git:**

```bash
# En tu PC
npm run build
git add .
git commit -m "Actualización"
git push

# En el servidor
cd /var/www/app-notas
git pull
npm install --production
npm run build
pm2 restart app-notas-pwa
```

**Si usas SCP:**

```bash
# En tu PC
npm run build
scp -r .nuxt .output root@TU_IP_DROPLET:/var/www/app-notas/

# En el servidor
pm2 restart app-notas-pwa
```

---

## 🛡️ PASO 8: Configurar Seguridad (Opcional)

### Firewall

```bash
# Instalar UFW
apt install -y ufw

# Permitir conexiones
ufw allow OpenSSH
ufw allow 'Nginx Full'

# Activar
ufw enable

# Verificar
ufw status
```

### Actualizaciones automáticas

```bash
# Instalar unattended-upgrades
apt install -y unattended-upgrades

# Configurar
dpkg-reconfigure -plow unattended-upgrades
```

---

## 📱 PASO 9: Instalar la PWA

### En tu dispositivo móvil:

1. Abre https://noty.live
2. **Android:** Menú → "Agregar a pantalla de inicio"
3. **iPhone:** Compartir → "Agregar a pantalla de inicio"

### En Desktop:

1. Abre https://noty.live en Chrome/Edge
2. Click en el ícono de instalación en la barra de direcciones
3. Confirma la instalación

---

## 🐛 Solución de Problemas

| Problema | Solución |
|----------|----------|
| No puedo conectarme por SSH | Verificar que la IP sea correcta |
| Error al instalar Node.js | Ejecutar de nuevo el comando curl |
| PM2 no inicia | Ver logs: `pm2 logs` |
| Error 502 | Verificar PM2: `pm2 status` |
| DNS no funciona | Esperar más tiempo o verificar registros |
| Certbot falla | Verificar DNS y puerto 80 abierto |
| SSL no funciona | `certbot renew` y reiniciar nginx |

**Ver logs detallados:**

```bash
pm2 logs app-notas-pwa --lines 100
tail -f /var/log/nginx/error.log
journalctl -u nginx -f
```

---

## 📊 Monitoreo

### Comandos útiles:

```bash
# Ver recursos del sistema
htop

# Espacio en disco
df -h

# Memoria
free -h

# Procesos de Node
pm2 monit

# Estado de servicios
systemctl status nginx
pm2 status
```

---

## ✅ Checklist Final

- [ ] Servidor configurado con Node.js y PM2
- [ ] Proyecto subido al servidor
- [ ] PM2 corriendo la aplicación
- [ ] Nginx configurado y corriendo
- [ ] DNS configurado y propagado
- [ ] SSL instalado y funcionando
- [ ] App accesible en https://noty.live
- [ ] PWA instalable
- [ ] Firewall configurado
- [ ] SSL renovando automáticamente

---

## 🎉 ¡Listo!

Tu PWA "Notas Rápidas" está funcionando en producción en **https://noty.live**

**Próximos pasos opcionales:**
- Configurar backups automáticos
- Agregar monitoring (Uptime Robot, Pingdom)
- Configurar analytics
- Implementar CI/CD
- Agregar notificaciones push

¿Necesitas ayuda? Consulta:
- **DEPLOYMENT.md** - Guía detallada
- **DNS-SETUP.md** - Configuración DNS
- **README.md** - Documentación general

