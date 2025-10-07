# 🗣️ AnonApp — Comparte, pregunta y responde de forma anónima o pública

**AnonApp** es una aplicación moderna inspirada en *Ask.fm*, que permite a los usuarios enviarse preguntas de forma anónima o identificada.  
Cada persona tiene un perfil público con su propio feed de mensajes y respuestas, fomentando la interacción social de manera divertida, segura y controlada.

Desarrollada con **Node.js, Express y MongoDB** en el backend, y **Ionic + Angular** en el frontend, AnonApp combina simplicidad, diseño mobile-first y una API REST modular.

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

- 🔐 Registro e inicio de sesión con JWT.
- 👤 Perfiles públicos con feed personalizable.
- 💬 Envío de mensajes anónimos o con usuario identificado.
- 💭 Respuestas públicas o privadas (decididas por el receptor).
- ❤️ Sistema de votos y reacciones.
- 🧩 Roles de usuario (admin / usuario estándar).
- ⚙️ Backend modular y seguro con Express + Mongoose.
- 📱 Frontend adaptable con Ionic + Angular.

---

## 🖼️ Arquitectura general

AnonApp/
├── backend/
│ ├── controllers/
│ │ ├── usuario.controller.js
│ │ ├── mensaje.controller.js
│ │ └── perfil.controller.js
│ ├── middleware/
│ │ └── auth.js
│ ├── models/
│ │ ├── usuario.js
│ │ ├── mensaje.js
│ │ └── voto.js
│ ├── routes/
│ │ ├── usuario.routes.js
│ │ ├── mensaje.routes.js
│ │ └── perfil.routes.js
│ ├── resources/es.json
│ └── index.js
│
└── frontend/ (Ionic + Angular)
├── src/
├── assets/
└── environments/


---

## 🧠 Flujo básico de uso

1. **Registro o inicio de sesión**  
   Los usuarios crean una cuenta con correo, contraseña y alias único.  

2. **Perfil público**  
   Cada perfil muestra su avatar, biografía y feed con las preguntas respondidas.

3. **Envío de mensajes**  
   Cualquier usuario autenticado puede enviar una pregunta a otro perfil.  
   El receptor decide si responderla públicamente o rechazarla.

4. **Feed y visibilidad**  
   Las preguntas respondidas se publican automáticamente en el feed del perfil del usuario.

5. **Votos y comunidad**  
   Los usuarios pueden votar o reaccionar a mensajes y respuestas visibles.

---

## ⚙️ Tecnologías utilizadas

### 🔧 Backend
- **Node.js** — entorno de ejecución.
- **Express.js** — framework para la API REST.
- **Mongoose** — modelado y conexión con MongoDB.
- **JWT (jsonwebtoken)** — autenticación de usuarios.
- **bcryptjs** — encriptación de contraseñas.

### 🎨 Frontend
- **Ionic Framework** — interfaz móvil adaptable.
- **Angular** — lógica de componentes y servicios.
- **RxJS / HttpClient** — comunicación con el backend.

### 🗄️ Base de datos
- **MongoDB Atlas** — base de datos NoSQL alojada en la nube.

---

## 💬 API REST (resumen)

| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| **POST** | `/usuarios/registrar` | Registro de usuario |
| **POST** | `/usuarios/login` | Autenticación |
| **GET** | `/perfil/:alias` | Perfil público con feed |
| **POST** | `/perfil/:alias/mensajes` | Enviar mensaje a un perfil |
| **GET** | `/mensajes` | Listar mensajes recibidos |
| **POST** | `/mensajes/:id/responder` | Responder a un mensaje |
| **DELETE** | `/mensajes/:id/rechazar` | Rechazar un mensaje |
| **POST** | `/mensajes/:id/votar` | Votar o reaccionar a una respuesta |

---

## 🧩 Ejemplo rápido (Postman)

**1. Registro**
```json
POST /usuarios/registrar
{
  "correo": "ejemplo@correo.com",
  "clave": "1234",
  "alias": "pedro"
}


POST /usuarios/login
{
  "correo": "ejemplo@correo.com",
  "clave": "1234"
}


POST /perfil/pedro/mensajes
Header: Authorization: Bearer <token>
{
  "cuerpo": "¿Cuál fue tu experiencia más divertida?",
  "anonimo": true
}


🧱 Estado actual del proyecto

✅ Backend funcional con MongoDB y JWT.

✅ Estructura completa de controladores y rutas.

⚙️ Integración con frontend en desarrollo (Ionic + Angular).

🚀 Próximas mejoras: notificaciones, sistema de seguidores y ranking de usuarios.

