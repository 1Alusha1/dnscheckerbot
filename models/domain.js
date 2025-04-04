import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DomainSchema = new Schema({
  domain: String,
  userId: Number,
  displayed: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: null,
  },
});

export default mongoose.model("Domain", DomainSchema);
