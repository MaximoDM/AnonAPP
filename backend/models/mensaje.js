const mongoose = require("mongoose");

const MensajeSchema = new mongoose.Schema(
  {
    // receptor (usuario dueño del perfil)
    para: { type: mongoose.Types.ObjectId, ref: "Usuario", required: true, index: true },

    // emisor (puede ser anónimo si null)
    de: { type: mongoose.Types.ObjectId, ref: "Usuario", default: null, index: true },

    // contenido del mensaje
    cuerpo: { type: String, required: true, trim: true, maxlength: 1000 },

    // respuesta del usuario receptor
    respuesta: { type: String, trim: true, maxlength: 2000, default: null },

    // estado del mensaje
    estado: { type: String, enum: ["pendiente", "respondido", "rechazado"], default: "pendiente" },

    // si la respuesta es visible públicamente
    visible: { type: Boolean, default: false, index: true },

    // votos (likes)
    votos: { type: Number, default: 0 },

    // metadata técnica
    meta: {
      ipHash: { type: String, index: true },
      uaHash: String,
      ref: String
    },

    eliminadoEn: Date
  },
  { timestamps: true, versionKey: false }
);

MensajeSchema.index({ para: 1, createdAt: -1 });
MensajeSchema.index({ para: 1, visible: 1, createdAt: -1 });
MensajeSchema.index({ estado: 1 });

module.exports = mongoose.model("Mensaje", MensajeSchema);
