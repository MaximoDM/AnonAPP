const mongoose = require("mongoose");

const InboxSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref:"User", required:true, index:true },
  slug:   { type:String, required:true, unique:true, lowercase:true, trim:true },
  isActive: { type:Boolean, default:true },
  blockedTags: { type:[String], default:[] },    // palabras a bloquear
  blockedIpHashes: { type:[String], default:[] } // ipHash vetadas
}, { timestamps:true, versionKey:false });

module.exports = mongoose.model("Inbox", InboxSchema);
