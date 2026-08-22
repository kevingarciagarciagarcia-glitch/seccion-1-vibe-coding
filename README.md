# Taller DAE — Ambiente Local de Desarrollo

Ambiente de desarrollo y pruebas con Docker Compose. Incluye MySQL 8, Nginx como proxy inverso, una app Node.js de prueba y Adminer para administrar la base de datos desde el navegador.

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Docker Compose v2 (incluido en Docker Desktop)

## Estructura del proyecto

```
.
├── app/                    # App Node.js de prueba
│   ├── Dockerfile
│   └── server.js
├── mysql/
│   └── init/               # Scripts .sql opcionales (se ejecutan al crear la BD)
├── nginx/
│   ├── nginx.conf          # Configuración del proxy inverso
│   ├── html/               # Archivos estáticos servidos en /
│   └── logs/               # Logs de acceso y error (generados al correr)
├── .env                    # Credenciales y puertos (no se commitea)
├── .gitignore
└── docker-compose.yml
```

## Servicios

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Nginx | http://localhost:8080 | Página estática y proxy hacia la app |
| App Node.js | http://localhost:8080/api/ | API de prueba (acceso solo via Nginx) |
| Adminer | http://localhost:8081 | Administrador web de MySQL |
| MySQL | red interna | No expuesto al host |

## Configuración

Las credenciales y puertos se leen del archivo `.env`. Podés editarlo antes de levantar el ambiente:

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=tallerdae
MYSQL_USER=devuser
MYSQL_PASSWORD=devpassword

MYSQL_PORT=3306
NGINX_PORT=8080
ADMINER_PORT=8081
```

> El archivo `.env` está en `.gitignore` y nunca se sube al repositorio.

## Levantar el ambiente

La primera vez (construye la imagen de la app):

```bash
docker compose up -d --build
```

Las veces siguientes:

```bash
docker compose up -d
```

Verificar que todos los contenedores están corriendo:

```bash
docker compose ps
```

Ver los logs en tiempo real:

```bash
# Todos los servicios
docker compose logs -f

# Solo un servicio
docker compose logs -f nginx
docker compose logs -f app
docker compose logs -f mysql
```

## Apagar el ambiente

Detener los contenedores (los datos persisten en el volumen):

```bash
docker compose down
```

Detener y eliminar también los volúmenes (borra los datos de MySQL):

```bash
docker compose down -v
```

## Probar la app

Una vez levantado, desde PowerShell:

```powershell
# Respuesta JSON de la app (via proxy Nginx)
Invoke-RestMethod http://localhost:8080/api/

# Health check
Invoke-RestMethod http://localhost:8080/api/health
```

## Conectarse a Adminer

1. Abrí http://localhost:8081 en el navegador
2. Completá el formulario con:
   - **Motor:** MySQL
   - **Servidor:** mysql
   - **Usuario:** devuser
   - **Contraseña:** devpassword
   - **Base de datos:** tallerdae

## Agregar scripts de inicialización a MySQL

Colocá archivos `.sql` en `mysql/init/`. Se ejecutan automáticamente la primera vez que se crea la base de datos (si el volumen no existe todavía).

```bash
# Ejemplo: crear tablas al iniciar
mysql/init/01_schema.sql
mysql/init/02_seed.sql
```

## Configurar el proxy hacia un backend real

En `nginx/nginx.conf`, el bloque `location /api/` apunta al contenedor `app` en el puerto `3000`. Para apuntar a otro servicio, cambiá:

```nginx
location /api/ {
    proxy_pass http://nombre_del_servicio:puerto/;
}
```

Y agregá el nuevo servicio en `docker-compose.yml` conectado a la red `tallerdae_net`.
