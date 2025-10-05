const mongoose = require("mongoose");
const { MESSAGE_STATUS } = require("./enums");

const MessageSchema = new mongoose.Schema({
  inboxId: { type: mongoose.Types.ObjectId, ref:"Inbox", required:true, index:true },
  body:    { type:String, required:true, trim:true, maxlength:1000 },
  status:  { type:String, enum: MESSAGE_STATUS, default:"unread", index:true },
  tags:    { type:[String], default:[] },
  meta: {
    ipHash: { type:String, index:true },
    uaHash: String,
    ref: String
  },
  deletedAt: Date
}, { timestamps:true, versionKey:false });

MessageSchema.index({ inboxId:1, createdAt:-1 });
MessageSchema.index({ inboxId:1, status:1, createdAt:-1 });

module.exports = mongoose.model("Message", MessageSchema);
