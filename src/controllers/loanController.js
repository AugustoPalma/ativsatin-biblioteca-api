const db = require("../data/db");
const { NotFoundError, ConflictError } = require("../utils/errors");

function listLoans(req, res) {
  const { userId, active } = req.query;

  let result = db.loans;

  if (userId) {
    result = result.filter((loan) => loan.userId === Number(userId));
  }

  if (active === "true") {
    result = result.filter((loan) => loan.returnedAt === null);
  }

  res.json(result);
}

function createLoan(req, res, next) {
  const { bookId, userId } = req.body;

  const book = db.books.find((b) => b.id === bookId);
  if (!book) {
    return next(new NotFoundError("Livro não encontrado"));
  }

  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return next(new NotFoundError("Usuário não encontrado"));
  }

  if (book.availableCopies < 1) {
    return next(new ConflictError("Não há cópias disponíveis para empréstimo"));
  }

  book.availableCopies -= 1;
  const loan = db.createLoan({ bookId, userId });
  res.status(201).json(loan);
}

function returnLoan(req, res, next) {
  const id = Number(req.params.id);
  const loan = db.loans.find((l) => l.id === id);

  if (!loan) {
    return next(new NotFoundError("Empréstimo não encontrado"));
  }

  if (loan.returnedAt !== null) {
    return next(new ConflictError("Este empréstimo já foi devolvido"));
  }

  loan.returnedAt = new Date().toISOString();

  const book = db.books.find((b) => b.id === loan.bookId);
  if (book) {
    book.availableCopies += 1;
  }

  res.json(loan);
}

module.exports = {
  listLoans,
  createLoan,
  returnLoan,
};
