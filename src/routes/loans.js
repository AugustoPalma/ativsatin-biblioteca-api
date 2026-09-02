const express = require("express");
const loanController = require("../controllers/loanController");
const { validateLoanPayload } = require("../middleware/validate");

const router = express.Router();

router.get("/", loanController.listLoans);
router.post("/", validateLoanPayload, loanController.createLoan);
router.post("/:id/return", loanController.returnLoan);

module.exports = router;
