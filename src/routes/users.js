const express = require("express");
const userController = require("../controllers/userController");
const { validateUserPayload } = require("../middleware/validate");

const router = express.Router();

router.get("/", userController.listUsers);
router.get("/:id", userController.getUser);
router.post("/", validateUserPayload, userController.createUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
