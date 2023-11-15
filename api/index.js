const express = require("express");
const router = express.Router();
const ctrlContact = require("../controller/index");

router.get("/", ctrlContact.getAllContacts);

router.get("/:contactId", ctrlContact.getContactById);

router.post("/", ctrlContact.addContact);

router.delete("/:contactId", ctrlContact.deleteContact);

router.put("/:contactId", ctrlContact.updateContact);

router.put("/:contactId/favorite", ctrlContact.updateStatusContact);

module.exports = router;
