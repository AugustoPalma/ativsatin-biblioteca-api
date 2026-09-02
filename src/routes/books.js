const express = require("express");
const bookController = require("../controllers/bookController");
const { validateBookPayload } = require("../middleware/validate");

const router = express.Router();

router.get("/", bookController.listBooks);
router.get("/:id", bookController.getBook);
router.post("/", validateBookPayload, bookController.createBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

module.exports = router;
