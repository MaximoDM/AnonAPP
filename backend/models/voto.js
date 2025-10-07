const mongoose = require("mongoose");

const VotoSchema = new mongoose.Schema(
  {
    usuarioId: { type: mongoose.Types.ObjectId, ref: "Usuario", required: true, index: true },
    mensajeId: { type: mongoose.Types.ObjectId, ref: "Mensaje", required: true, index: true },
    tipo: { type: String, enum: ["like", "dislike"], default: "like" }
  },
  { timestamps: true, versionKey: false }
);

VotoSchema.index({ usuarioId: 1, mensajeId: 1 }, { unique: true });

module.exports = mongoose.model("Voto", VotoSchema);
