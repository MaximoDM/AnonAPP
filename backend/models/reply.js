const mongoose = require("mongoose");
const { REPLY_VISIBILITY } = require("./enums");

const ReplySchema = new mongoose.Schema({
  messageId: { type: mongoose.Types.ObjectId, ref:"Message", required:true, index:true },
  body: { type:String, required:true, trim:true, maxlength:1000 },
  visibility: { type:String, enum: REPLY_VISIBILITY, default:"private", index:true }
}, { timestamps:true, versionKey:false });

module.exports = mongoose.model("Reply", ReplySchema);
