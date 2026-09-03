const express = require("express");
const ctrl = require("./controllers");
const { validateBookPayload, validateUserPayload, validateLoanPayload, errorHandler } = require("./middleware");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Books
app.get("/books", ctrl.listBooks);
app.get("/books/:id", ctrl.getBook);
app.post("/books", validateBookPayload, ctrl.createBook);
app.put("/books/:id", ctrl.updateBook);
app.delete("/books/:id", ctrl.deleteBook);

// Users
app.get("/users", ctrl.listUsers);
app.get("/users/:id", ctrl.getUser);
app.post("/users", validateUserPayload, ctrl.createUser);
app.delete("/users/:id", ctrl.deleteUser);

// Loans
app.get("/loans", ctrl.listLoans);
app.post("/loans", validateLoanPayload, ctrl.createLoan);
app.post("/loans/:id/return", ctrl.returnLoan);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
