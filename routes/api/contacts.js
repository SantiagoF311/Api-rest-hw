const express = require("express");
const Joi = require("joi");
const contacts = require("../../models/contacts");

const router = express.Router();

const addContactSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.number().integer().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/),
  email: Joi.string().email(),
  phone: Joi.number().integer(),
}).or("name", "email", "phone");

router.get("/", async (req, res, next) => {
  const allContacts = await contacts.listContacts();
  res.json(allContacts);
});

router.get("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const contact = await contacts.getContactById(contactId);
  if (contact) {
    res.json(contact);
  } else return res.status(404).json({ message: "Contact not found" });
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newContact = await contacts.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  try {
    const contact = await contacts.removeContact(contactId);

    if (contact) {
      res.json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const updateFiles = req.body;

  try {
    await updateContactSchema.validateAsync(updateFiles);

    const updatedContact = await contacts.updateContact(contactId, updateFiles);

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact updated successfully:", updatedContact });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "Contact not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
