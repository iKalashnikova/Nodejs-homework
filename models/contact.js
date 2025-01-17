import { Schema, model } from "mongoose";
import { handleSaveError, validateAtUpdate} from "./hooks.js";

const contactSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      favorite: {
        type: Boolean,
        default: false,
      },
}, {versionKey: false, timestamps: true});


contactSchema.pre("findOneAndUpdate", validateAtUpdate );

contactSchema.post("save", handleSaveError );
contactSchema.post("findOneAndUpdate", handleSaveError );

const Contact = model("contact", contactSchema);

export default Contact;
