# 📝 Notas Rápidas - PWA

Una aplicación web progresiva (PWA) desarrollada con Vue.js y Nuxt.js que permite gestionar notas de forma offline.

## ✨ Características

- ✅ Crear, editar y eliminar notas
- ✅ Almacenamiento local persistente
- ✅ Funciona completamente offline
- ✅ Instalable en dispositivos móviles y desktop
- ✅ Diseño responsive y moderno
- ✅ Soporte para modo oscuro automático
- ✅ Animaciones suaves

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18.x o superior
- npm o yarn

### Instalación

1. Clona el repositorio
```bash
git clone <tu-repositorio>
cd AppNotas
```

2. Instala las dependencias
```bash
npm install
```

3. Ejecuta el servidor de desarrollo
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:3000`

### Compilar para Producción

```bash
npm run build
```

Para previsualizar la compilación:
```bash
npm run preview
```

## 🌐 Despliegue en Digital Ocean

### Opción 1: Despliegue con PM2 y Nginx (Recomendado)

#### 1. Preparar el Droplet

```bash
# Conectarse al servidor
ssh root@tu-ip-droplet

# Actualizar el sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PM2
npm install -g pm2

# Instalar Nginx
apt install -y nginx
```

#### 2. Subir el Proyecto

```bash
# En tu máquina local, compila el proyecto
npm run build

# Crear un archivo .tar con los archivos necesarios
tar -czf app-notas.tar.gz \
  .nuxt \
  .output \
  package.json \
  package-lock.json \
  nuxt.config.ts \
  tsconfig.json

# Subir al servidor (reemplaza con tus datos)
scp app-notas.tar.gz root@tu-ip-droplet:/var/www/
```

```bash
# En el servidor, descomprime
cd /var/www
tar -xzf app-notas.tar.gz
cd AppNotas
npm install --production
```

#### 3. Configurar PM2

```bash
# Crear archivo de configuración de PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'app-notas-pwa',
    script: 'node_modules/.bin/nuxt',
    args: 'start',
    cwd: '/var/www/AppNotas',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js

# Configurar PM2 para iniciar al arrancar el sistema
pm2 startup
pm2 save
```

#### 4. Configurar Nginx

```bash
# Crear configuración de Nginx
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Habilitar el sitio
ln -s /etc/nginx/sites-available/noty.live /etc/nginx/sites-enabled/

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

#### 5. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
certbot --nginx -d noty.live -d www.noty.live

# El certificado se renovará automáticamente
```

### Opción 2: Despliegue con Docker (Alternativa)

#### 1. Crear Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node_modules/.bin/nuxt", "start"]
```

#### 2. Crear docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

#### 3. Desplegar

```bash
# En el servidor, instalar Docker
apt install -y docker.io docker-compose

# Subir archivos al servidor
scp -r . root@tu-ip-droplet:/var/www/AppNotas

# En el servidor
cd /var/www/AppNotas
docker-compose up -d --build
```

## 📱 Instalación en Dispositivo

### En Móvil:

1. Abre la aplicación en el navegador
2. En Chrome Android: Menú → "Agregar a pantalla de inicio"
3. En Safari iOS: Compartir → "Agregar a pantalla de inicio"

### En Desktop:

1. Abre la aplicación en Chrome o Edge
2. Haz clic en el ícono de instalación en la barra de direcciones
3. Confirma la instalación

## 🛠️ Tecnologías Utilizadas

- **Vue.js 3** - Framework JavaScript
- **Nuxt.js 3** - Framework de Vue.js
- **@vite-pwa/nuxt** - Soporte PWA
- **Workbox** - Service Worker
- **LocalStorage** - Almacenamiento local
- **CSS3** - Estilos y responsive design

## 📝 Notas Técnicas

- La aplicación funciona completamente offline gracias al Service Worker
- Las notas se guardan en LocalStorage del navegador
- La configuración PWA permite instalación nativa
- Diseño responsive adaptado a móvil y desktop
- Soporte automático para modo oscuro

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Previsualizar producción

# PM2
pm2 start ecosystem.config.js    # Iniciar app
pm2 stop app-notas-pwa          # Detener app
pm2 restart app-notas-pwa       # Reiniciar app
pm2 logs app-notas-pwa          # Ver logs
pm2 monit                        # Monitor en tiempo real

# Nginx
nginx -t                         # Verificar configuración
systemctl restart nginx          # Reiniciar Nginx
systemctl status nginx           # Estado de Nginx

# Certbot
certbot renew                    # Renovar certificados
certbot certificates             # Listar certificados
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

Desarrollado para tareas de Ingeniería Keller

