const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
  {
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    claveHash: { type: String, required: true, select: false },
    alias: { type: String, unique: true, lowercase: true, trim: true, index: true },
    avatar: String,
    bio: { type: String, trim: true, maxlength: 280 },
    rol: { type: String, enum: ["usuario", "admin"], default: "usuario", index: true },
    seguidores: [{ type: mongoose.Types.ObjectId, ref: "Usuario" }],
    seguidos: [{ type: mongoose.Types.ObjectId, ref: "Usuario" }],
    totalMensajes: { type: Number, default: 0 },
    ultimoMensajeEn: Date,
    eliminadoEn: Date
  },
  { timestamps: true, versionKey: false }
);

UsuarioSchema.set("toJSON", { transform: (_d, r) => { delete r.claveHash; return r; } });

module.exports = mongoose.model("Usuario", UsuarioSchema);
