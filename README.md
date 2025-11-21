# 🗣️ AnonApp — Comparte, pregunta y responde de forma anónima o pública

**AnonApp** es una aplicación moderna inspirada en *Ask.fm*, que permite a los usuarios enviarse preguntas de forma anónima o identificada.  
Cada persona tiene un perfil público con su propio feed de mensajes y respuestas, fomentando la interacción social de manera divertida, segura y controlada.

Desarrollada con **Node.js, Express y Sequelize (MySQL/MariaDB)** en el backend, y **Ionic + Angular** en el frontend, AnonApp combina simplicidad, diseño mobile-first y una API REST modular.

---

## 🌍 Descripción del proyecto

En **AnonApp**, cada usuario puede:

- Crear su propio perfil público con **alias**, **avatar** y **biografía**.  
- Recibir mensajes de otros usuarios (pueden ser **anónimos** o **identificados**).  
- Responder públicamente a los mensajes que elija y mostrar esas respuestas en su feed.  
- Gestionar su bandeja de entrada: aceptar, responder, rechazar o borrar mensajes.  
- Votar mensajes respondidos con sistema de **likes/dislikes**.  
- Explorar un panel con **usuarios más activos/destacados**.  
- Buscar perfiles por alias mediante un panel de **búsqueda**.  

El objetivo es **dar voz a las preguntas** de forma segura y entretenida, manteniendo el control sobre la visibilidad de cada mensaje y del perfil.

---

## ✨ Características principales

- 🔐 **Autenticación con JWT** (Bearer) y expiración de token.
- 👤 Perfiles públicos con **alias**, **avatar**, **bio** y fecha de creación.
- 🖼️ Gestión de **avatar**:
  - Subida desde la App.
  - Optimización en el backend con `sharp` (redimensionado a 256x256 y compresión JPEG).
  - Almacenado como **base64** en la base de datos con límite de tamaño.
- 💬 Envío de mensajes **anónimos o identificados** entre usuarios.
- 📥 Bandeja de entrada con estados:
  - `pending` (pendiente)
  - `replied` (respondido y visible)
  - `rejected` (rechazado/oculto)
- 📰 Feed público:
  - Solo muestra mensajes **respondidos y visibles** (`visible = true`).
  - Incluye información opcional del remitente (alias + avatar si no es anónimo).
- 👍 / 👎 Sistema de **votos** con:
  - Campo `votes` en el mensaje.
  - Un voto por usuario y mensaje.
  - No se permite votar tus propios mensajes.
- 🧩 Roles de usuario (**admin / user**):
  - Moderación de mensajes (rechazar/borrar) por parte de administradores.
- 📊 Paneles en la App:
  - Panel de **Top usuarios** por número de comentarios recibidos.
  - Panel/buscador de usuarios por alias.
- ⚙️ Backend modular con **Express + Sequelize** y middlewares dedicados.

---

## 🧠 Flujo básico de uso

1. **Registro o inicio de sesión**  
   Los usuarios crean una cuenta con su **email**, **password** y un **alias** único.  

2. **Perfil público**  
   Cada perfil muestra:
   - Avatar
   - Biografía
   - Alias
   - Fecha de creación
   - Feed de mensajes **respondidos** y visibles

3. **Envío de mensajes**  
   Cualquier usuario autenticado puede enviar una pregunta a otro perfil, eligiendo:
   - Enviar el mensaje como **anónimo**
   - O enviar el mensaje identificado (se enlaza su alias y avatar)

4. **Gestión de la bandeja de entrada**  
   El receptor ve sus mensajes recibidos (excepto los rechazados) y puede:
   - Responderlos → pasan a estado `replied` y se vuelven visibles en el feed.
   - Rechazarlos → estado `rejected` y `visible = false`.
   - Eliminarlos de forma definitiva.

5. **Feed y visibilidad**  
   Solo los mensajes con:
   - `status = replied`
   - `visible = true`  
   aparecen en el perfil público.

6. **Votos y comunidad**  
   Los usuarios pueden votar mensajes respondidos:
   - `like` → suma +1
   - `dislike` → resta −1  
   No se puede votar dos veces el mismo mensaje ni votar tu propio mensaje.

7. **Paneles (Top y búsqueda)**  
   En la App Ionic se muestran:
   - **Top usuarios** ordenados por número de mensajes recibidos.
   - **Buscador** de usuarios por alias para descubrir nuevos perfiles.

---

## ⚙️ Tecnologías utilizadas

### 🔧 Backend
- **Node.js** — entorno de ejecución  
- **Express.js** — framework para la API REST  
- **Sequelize ORM** — modelado y conexión con **MySQL/MariaDB**  
- **JWT (jsonwebtoken)** — autenticación de usuarios con token Bearer  
- **bcryptjs** — encriptación de contraseñas (`passwordHash`)  
- **sharp** — procesamiento y optimización de imágenes (avatares)  
- **multer** — manejo de subida de archivos de imagen (avatares, si se usa endpoint multipart)

### 🎨 Frontend
- **Ionic Framework** — interfaz móvil adaptable (componentes, modales, paneles, etc.)  
- **Angular** — lógica de componentes, servicios y routing  
- **RxJS / HttpClient** — comunicación con el backend y gestión de flujos asíncronos

### 🗄️ Base de datos
- **MySQL/MariaDB** — base de datos relacional administrada con Sequelize ORM

---

## 🔐 Autenticación y seguridad

- Autenticación basada en **JWT**:
  - El backend firma tokens con `JWT_SECRET`.
  - El token incluye: `uid`, `alias` y `role`.
  - Caducidad configurada (por ejemplo, `60m`).
- Middleware `authRequired`:
  - Lee el header `Authorization: Bearer <token>`.
  - Verifica el token y añade `req.user = { uid, alias, role, isAdmin }`.
  - Responde `401` si falta el token o es inválido.
- Middleware `requireAdmin`:
  - Solo permite acceso a usuarios con `role = "admin"`.

---

## 👤 Perfiles, avatares y bio

- Cada usuario tiene:
  - `alias` único.
  - `avatar` (imagen en base64 optimizada).
  - `bio` (texto corto).
  - `role` (`user` o `admin`).
  - `totalMessages` (contador de mensajes recibidos, útil para rankings).
- El endpoint de perfil público devuelve:
  - Datos del perfil (alias, avatar, bio, createdAt).
  - Un feed de mensajes respondidos y visibles.
- Actualización de perfil:
  - Cambio de bio.
  - Cambio de alias (si se permite).
  - Actualización del avatar.

El backend, al guardar un avatar, usa `sharp` para:
- Redimensionar a **256x256** (modo *cover*).
- Convertir a **JPEG** calidad 80.
- Comprobar que la imagen final no exceda un tamaño máximo (por ejemplo, ~100 KB).
- Guardar el resultado como `data:image/jpeg;base64,...` en la base de datos.

---

## 💬 API REST (resumen)

> Los nombres exactos de algunos endpoints pueden variar según la configuración de las rutas, pero la lógica base es la siguiente:

### 👤 Usuarios

| Método | Endpoint                      | Descripción |
|--------|-------------------------------|-------------|
| **POST** | `/api/users/register`         | Registro de usuario nuevo (email, password, alias) |
| **POST** | `/api/users/login`            | Inicio de sesión (retorna token JWT, alias, rol, etc.) |
| **GET**  | `/api/users/me`               | Obtener el usuario autenticado (sin `passwordHash`) |
| **PUT**  | `/api/users/me`               | Actualizar bio, avatar (base64) y/o alias |
| **POST** | `/api/users/avatar`           | Actualizar avatar (base64 optimizado en backend) |
| **GET**  | `/api/users/:alias`           | Obtener usuario por alias (p. ej. para paneles) |
| **GET**  | `/api/users/top`              | Obtener top de usuarios ordenados por total de mensajes recibidos |
| **GET**  | `/api/users/search?q=texto`   | Buscar usuarios por alias (usando `LIKE` case-insensitive) |

### 🧑‍🤝‍🧑 Perfil público y mensajes

| Método | Endpoint                              | Descripción |
|--------|----------------------------------------|-------------|
| **GET**  | `/api/profile/:alias`                  | Obtener perfil público + feed de mensajes respondidos y visibles |
| **POST** | `/api/profile/:alias/messages`         | Enviar mensaje a un usuario (anónimo o identificado) |

### 💌 Bandeja de mensajes del usuario autenticado

| Método | Endpoint                          | Descripción |
|--------|-----------------------------------|-------------|
| **GET**  | `/api/messages`                   | Listar todos los mensajes recibidos por el usuario actual (excepto rechazados) |
| **GET**  | `/api/messages/:alias/messages`   | Listar mensajes enviados a un usuario concreto (útil para paneles) |
| **PUT**  | `/api/messages/:id/reply`         | Responder a un mensaje → `status = replied`, `visible = true`, `repliedAt` |
| **DELETE** | `/api/messages/:id/reject`      | Rechazar mensaje (lo marca como `rejected` y `visible = false`) |
| **DELETE** | `/api/messages/:id/delete`      | Eliminar un mensaje de forma definitiva (propietario o admin) |

### 👍 Votos

| Método | Endpoint                    | Descripción |
|--------|-----------------------------|-------------|
| **POST** | `/api/messages/:id/vote`    | Votar mensaje (body `{ "type": "like" | "dislike" }`). Un voto por usuario y mensaje, no puedes votar tus propios mensajes |

---

## 🧩 Ejemplo rápido (Postman)

### 1️⃣ Registro

POST /api/users/register
```json
{
  "email": "ejemplo@correo.com",
  "password": "123456",
  "alias": "pedro"
}
```

2️⃣ Inicio de sesión

POST /api/users/login
```json
{
  "email": "ejemplo@correo.com",
  "password": "123456"
}
```
Respuesta (ejemplo):
```json
{
  "ok": true,
  "token": "<jwt>",
  "id": 1,
  "alias": "pedro",
  "email": "ejemplo@correo.com",
  "role": "user"
}
```
3️⃣ Envío de mensaje a un perfil
POST /api/profile/pedro/messages
Header: Authorization: Bearer <token>
```json
{
  "body": "¿Cuál fue tu experiencia más divertida?",
  "anonymous": true
}
```
4️⃣ Responder un mensaje recibido
PUT /api/messages/123/reply
Header: Authorization: Bearer <token>
```json
{
  "body": "Mi experiencia más divertida fue..."
}
```
5️⃣ Votar una respuesta
POST /api/messages/123/vote
Header: Authorization: Bearer <token>
```json
{
  "type": "like"
}

```

🧱 Estado actual del proyecto

✅ Backend funcional con:

· Modelos User, Message, Vote y asociaciones.

· Autenticación JWT y middleware de protección.

· Lógica de estados de mensaje (pending, replied, rejected).

· Gestión de visibilidad (visible) y fechas (repliedAt).

· Sistema de votos con control de duplicados y prohibición de auto-voto.

· Optimización de avatares con sharp y almacenamiento en base de datos.

· Endpoints para ranking de usuarios y búsqueda por alias.

✅ Frontend Ionic + Angular en desarrollo activo:

· Páginas de login/registro.

· Perfil, feed y bio.

· Envío de mensajes (anónimo / identificado).

· Paneles de Top usuarios y búsqueda.

🚀 Próximas mejoras:

· Notificaciones en tiempo real.

· Sistema de seguidores.

· Filtros avanzados en los paneles.

· Métricas adicionales de interacción.

--- 

## 📦 Colección Postman Puedes probar todos los endpoints directamente en Postman: 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://interstellar-meadow-612657.postman.co/workspace/New-Team-Workspace~01c0cc51-a238-427b-b6c9-4227ed824654/collection/20352484-cc0e1eb1-a6a9-4b64-aca7-f227c3735f7f?action=share&creator=20352484&active-environment=20352484-f893a8f5-f74a-456b-a425-850fed9992a0)

---

🧩 Configuración del entorno

1. Clona el repositorio y entra en la carpeta del backend.

2. Copia el archivo .env.example y renómbralo como .env:

cp .env.example .env

3. Configura en .env:

· Credenciales de base de datos (MySQL/MariaDB).

· JWT_SECRET.

· Otros parámetros necesarios (puerto, CORS, etc.).

4. Instala dependencias y arranca el servidor:

npm install
npm run dev


5. Inicia la App Ionic y configura la baseUrl para que apunte al backend (por ejemplo, http://localhost:8080 o la URL desplegada).
