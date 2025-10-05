const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type:String, required:true, unique:true, lowercase:true, trim:true, index:true },
  passwordHash: { type:String, required:true, select:false },
  handle: { type:String, unique:true, sparse:true, lowercase:true, trim:true },
  avatar: String,
  recordsCount: { type:Number, default:0 },   
  lastMessageAt: Date,                      
  deletedAt: Date
}, { timestamps:true, versionKey:false, strict:"throw" });

UserSchema.set("toJSON", { transform:(_d, r)=>{ delete r.passwordHash; return r; } });

module.exports = mongoose.model("User", UserSchema);
