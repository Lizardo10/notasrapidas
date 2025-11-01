# 🌐 Configuración DNS para noty.live

Esta guía te ayudará a configurar tu dominio **noty.live** para que apunte a tu Droplet de Digital Ocean.

---

## 📋 Prerrequisitos

1. Tener un dominio registrado (noty.live)
2. Tener un Droplet de Digital Ocean con la IP pública
3. Acceso al panel de tu registrador de dominios

---

## 🎯 Opción 1: Usar Namecheap (Ejemplo)

### Paso 1: Obtener la IP del Droplet

1. Inicia sesión en Digital Ocean
2. Ve a **Droplets**
3. Copia la **IPv4** de tu Droplet (ejemplo: `123.45.67.89`)

### Paso 2: Configurar DNS en Namecheap

1. Inicia sesión en Namecheap
2. Ve a **Domain List**
3. Haz clic en **Manage** al lado de **noty.live**
4. Ve a la sección **Advanced DNS**

#### Configurar Registros A:

Agrega/edita estos registros:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | `@` | `TU_IP_DROPLET` | Automatic |
| A Record | `www` | `TU_IP_DROPLET` | Automatic |

Ejemplo:
- Host: `@` → Value: `123.45.67.89`
- Host: `www` → Value: `123.45.67.89`

#### Opcional: Configurar CNAME (Alternativa al A Record para www)

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME Record | `www` | `noty.live` | Automatic |

5. Guarda los cambios

---

## 🎯 Opción 2: Usar Cloudflare (Recomendado para SSL)

### Paso 1: Agregar Dominio a Cloudflare

1. Inicia sesión en Cloudflare
2. Haz clic en **Add a Site**
3. Ingresa **noty.live**
4. Sigue el asistente para completar el escaneo

### Paso 2: Cambiar Name Servers

1. Cloudflare te dará **Name Servers** (ej: `ns1.cloudflare.com`, `ns2.cloudflare.com`)
2. Ve a tu registrador de dominios (donde compraste noty.live)
3. Cambia los Name Servers a los de Cloudflare
4. Espera 24-48 horas a que se propague

### Paso 3: Configurar DNS en Cloudflare

Una vez que Cloudflare detecte el dominio:

1. Ve a **DNS** → **Records**
2. Agrega/edit estos registros:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | `@` | `TU_IP_DROPLET` | ✅ Proxied |
| A | `www` | `TU_IP_DROPLET` | ✅ Proxied |

3. Guarda los cambios

### Ventajas de Cloudflare:

- ✅ SSL automático y gratuito
- ✅ CDN global
- ✅ Protección DDoS
- ✅ Analytics
- ✅ Cache automático

---

## 🎯 Opción 3: Usar DigitalOcean DNS

### Paso 1: Agregar Dominio

1. Inicia sesión en Digital Ocean
2. Ve a **Networking** → **Domains**
3. Haz clic en **Add Domain**
4. Ingresa **noty.live**

### Paso 2: Configurar Records

Agrega estos registros:

| Type | Hostname | Will Direct To | TTL |
|------|----------|----------------|-----|
| A | `@` | `TU_IP_DROPLET` | 3600 |
| A | `www` | `TU_IP_DROPLET` | 3600 |

### Paso 3: Actualizar Name Servers

1. Copia los **Name Servers** que Digital Ocean te proporciona
2. Ve a tu registrador de dominios
3. Actualiza los Name Servers

---

## 🔍 Verificar la Propagación DNS

### Comandos para Verificar:

```bash
# Verificar registros A
nslookup noty.live
nslookup www.noty.live

# O con dig (más detallado)
dig noty.live +short
dig www.noty.live +short

# Verificar desde diferentes ubicaciones
# https://dnschecker.org/
```

### Tiempo de Propagación:

- Normalmente: 1-4 horas
- Máximo: 24-48 horas

---

## 🧪 Probar la Configuración

### 1. Verificar que el dominio apunta a la IP correcta:

```bash
ping noty.live
# Debería mostrar: ping 123.45.67.89
```

### 2. Verificar con curl:

```bash
curl -I http://noty.live
# Debería mostrar: HTTP/1.1 200 OK
```

### 3. Verificar SSL (después de configurar):

```bash
curl -I https://noty.live
# Debería mostrar: HTTP/2 200
```

---

## 🔒 Configurar SSL con Let's Encrypt

Una vez que el DNS esté propagado:

```bash
# En tu servidor
ssh root@TU_IP_DROPLET

# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obtener certificado
certbot --nginx -d noty.live -d www.noty.live

# Verificar
certbot certificates
```

---

## ❗ Problemas Comunes

### El dominio no resuelve

```bash
# Verifica que los registros A estén correctos
dig noty.live

# Verifica que no haya firewall bloqueando
ufw status

# Verifica que Nginx esté corriendo
systemctl status nginx
```

### Error "Domain already exists" en Let's Encrypt

```bash
# Verificar si el certificado ya existe
certbot certificates

# Si existe, renovar
certbot renew
```

### Certbot no puede verificar el dominio

1. Verifica que el dominio apunte correctamente: `ping noty.live`
2. Verifica que el puerto 80 esté abierto: `ufw allow 'Nginx Full'`
3. Verifica que Nginx esté corriendo: `systemctl status nginx`

---

## 📊 Configuración de Otros Registradores

### GoDaddy

1. Inicia sesión en GoDaddy
2. Ve a **My Products** → **DNS**
3. Edita los registros A
4. Agrega:
   - `@` → `TU_IP_DROPLET`
   - `www` → `TU_IP_DROPLET`

### Google Domains

1. Inicia sesión en Google Domains
2. Ve a **DNS**
3. Agrega edita registros personalizados
4. Agrega:
   - Type: `A`, Name: `@`, Data: `TU_IP_DROPLET`
   - Type: `A`, Name: `www`, Data: `TU_IP_DROPLET`

### IONOS (1&1)

1. Inicia sesión en IONOS
2. Ve a **Dominios** → **noty.live** → **DNS**
3. Agrega/edita registros:
   - Tipo: A, Nombre: `@`, Valor: `TU_IP_DROPLET`
   - Tipo: A, Nombre: `www`, Valor: `TU_IP_DROPLET`

---

## 🎉 Checklist Final

- [ ] Registro A configurado para `@` apuntando a la IP del Droplet
- [ ] Registro A o CNAME configurado para `www`
- [ ] DNS propagado (verificado con ping/nslookup)
- [ ] Nginx configurado y corriendo
- [ ] SSL instalado con Let's Encrypt
- [ ] Dominio accesible desde navegador
- [ ] Certificado renovando automáticamente

---

## 📞 Soporte Adicional

Si tienes problemas:

1. **Herramientas de diagnóstico DNS:**
   - https://dnschecker.org/
   - https://www.whatsmydns.net/
   - https://mxtoolbox.com/DNSLookup.aspx

2. **Verificar sintaxis de registros:**
   - A Record: Solo IP (ej: 123.45.67.89)
   - CNAME: Solo hostname (ej: noty.live o www.noty.live)
   - TTL: Normalmente 3600 o Automático

3. **Contactar soporte:**
   - Tu registrador de dominios
   - Digital Ocean Support
   - Cloudflare Support (si usas Cloudflare)

---

¡Una vez configurado, tu aplicación estará disponible en **https://noty.live**! 🎉

