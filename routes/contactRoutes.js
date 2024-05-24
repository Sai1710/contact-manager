const express = require("express");
const {
  getContact,
  getContacts,
  deleteContact,
  createContact,
  updateContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
router.use(validateToken);
router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).delete(deleteContact).put(updateContact);

module.exports = router;
