const express = require("express");
const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");
const loansRouter = require("./routes/loans");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/books", booksRouter);
app.use("/users", usersRouter);
app.use("/loans", loansRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
