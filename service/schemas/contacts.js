const mongoose = require("mongoose");
const Joi = require('joi');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const contactModel = mongoose.model("contact", contactSchema);

contactModel.validateUpdate = function (contact) {
  const schema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z\s]+$/),
    email: Joi.string().email(),
    phone: Joi.number(),
    favorite: Joi.boolean(),
  });
  return schema.validate(contact);
};

contactModel.validateAdd = function (contact) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .pattern(/^[a-zA-Z\s]+$/),
    email: Joi.string().email().required(),
    phone: Joi.number().required(),
    favorite: Joi.boolean(),
  });

  return schema.validate(contact);
};

module.exports = contactModel;
