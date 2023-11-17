const express = require("express");
const router = express.Router();
const contactCtrl = require("../controller/index");
const authCtrl = require("../controller/auth");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/logout", authMiddleware.checkToken, authCtrl.signOut);

router.get("/current", authMiddleware.checkToken, authCtrl.getCurrentUser);

router.get("/", authMiddleware.checkToken, contactCtrl.getAllContacts);

router.get(
  "/:contactId",
  authMiddleware.checkToken,
  contactCtrl.getContactById
);

router.post("/", authMiddleware.checkToken, contactCtrl.addContact);

router.delete(
  "/:contactId",
  authMiddleware.checkToken,
  contactCtrl.deleteContact
);

router.put("/:contactId", authMiddleware.checkToken, contactCtrl.updateContact);

router.put(
  "/:contactId/favorite",
  authMiddleware.checkToken,
  contactCtrl.updateStatusContact
);

router.post("/signup", authCtrl.signUp);

router.post("/login", authCtrl.signIn);

module.exports = router;
