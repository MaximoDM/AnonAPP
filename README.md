# 🗣️ AnonApp — Comparte, pregunta y responde de forma anónima o pública

**AnonApp** es una aplicación moderna inspirada en *Ask.fm*, que permite a los usuarios enviarse preguntas de forma anónima o identificada.  
Cada persona tiene un perfil público con su propio feed de mensajes y respuestas, fomentando la interacción social de manera divertida, segura y controlada.

Desarrollada con **Node.js, Express y Sequelize (MySQL/MariaDB)** en el backend, y **Ionic + Angular** en el frontend, AnonApp combina simplicidad, diseño mobile-first y una API REST modular.

---

## 🌍 Descripción del proyecto

En **AnonApp**, cada usuario puede:
- Crear su propio perfil público con alias, avatar y biografía.  
- Recibir mensajes de otros usuarios (pueden ser anónimos o identificados).  
- Responder públicamente a los mensajes que elija.  
- Votar o reaccionar a las respuestas de otros.  
- Seguir a otros perfiles y descubrir sus feeds de preguntas y respuestas.  

El objetivo es **dar voz a las preguntas** de forma segura y entretenida, manteniendo el control sobre la visibilidad de cada mensaje.

---

## ✨ Características principales

- 🔐 Registro e inicio de sesión con **JWT**  
- 👤 Perfiles públicos con feed personalizable  
- 💬 Envío de mensajes **anónimos o con usuario identificado**  
- 💭 Respuestas públicas o privadas (decididas por el receptor)  
- ❤️ Sistema de **votos y reacciones**  
- 🧩 Roles de usuario (**admin / user**)  
- ⚙️ Backend modular y seguro con **Express + Sequelize**  
- 📱 Frontend adaptable con **Ionic + Angular**

---

## 🧠 Flujo básico de uso

1. **Registro o inicio de sesión**  
   Los usuarios crean una cuenta con su **email**, **password** y **alias** único.  

2. **Perfil público**  
   Cada perfil muestra su avatar, biografía y feed con las preguntas respondidas.  

3. **Envío de mensajes**  
   Cualquier usuario autenticado puede enviar una pregunta a otro perfil.  
   El receptor decide si responderla públicamente o descartarla.  

4. **Feed y visibilidad**  
   Las preguntas respondidas se publican automáticamente en el feed del perfil del usuario.  

5. **Votos y comunidad**  
   Los usuarios pueden votar o reaccionar a mensajes y respuestas visibles.

---

## ⚙️ Tecnologías utilizadas

### 🔧 Backend
- **Node.js** — entorno de ejecución  
- **Express.js** — framework para la API REST  
- **Sequelize ORM** — modelado y conexión con **MySQL/MariaDB**  
- **JWT (jsonwebtoken)** — autenticación de usuarios  
- **bcryptjs** — encriptación de contraseñas  

### 🎨 Frontend
- **Ionic Framework** — interfaz móvil adaptable  
- **Angular** — lógica de componentes y servicios  
- **RxJS / HttpClient** — comunicación con el backend  

### 🗄️ Base de datos
- **MySQL / MariaDB** — base de datos relacional administrada con Sequelize ORM

---

## 💬 API REST (resumen)

| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| **POST** | `/api/users/register` | Registro de usuario |
| **POST** | `/api/users/login` | Autenticación de usuario |
| **GET** | `/api/profile/:alias` | Obtener perfil público con feed |
| **POST** | `/api/profile/:alias/messages` | Enviar mensaje a un perfil |
| **GET** | `/api/messages` | Listar mensajes recibidos |
| **POST** | `/api/messages/:id/reply` | Responder a un mensaje |
| **DELETE** | `/api/messages/:id/discard` | Descartar un mensaje |
| **POST** | `/api/messages/:id/vote` | Votar o reaccionar a una respuesta |

---

## 🧩 Ejemplo rápido (Postman)

### 1️⃣ Registro
```json
POST /api/users/register
{
  "email": "ejemplo@correo.com",
  "password": "1234",
  "alias": "pedro"
}
```

### 2️⃣ Inicio de sesión
```json
POST /api/users/login
{
  "email": "ejemplo@correo.com",
  "password": "1234"
}
```
### 3️⃣ Envío de mensaje
```json
POST /api/profile/pedro/messages
Header: Authorization: Bearer <token>
{
  "body": "¿Cuál fue tu experiencia más divertida?",
  "anonymous": true
}
```

🧱 Estado actual del proyecto

✅ Backend funcional con Sequelize y JWT
✅ Controladores, modelos y rutas implementadas
⚙️ Integración con el frontend Ionic + Angular en desarrollo
🚀 Próximas mejoras: notificaciones, sistema de seguidores y ranking de usuarios