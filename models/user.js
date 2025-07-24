import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: Number,
  type: String,
  links: Array,
  domains: Array,
});

export default mongoose.model("User", UserSchema);
