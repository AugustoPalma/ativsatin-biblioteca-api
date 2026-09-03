const db = require("./db");
const { NotFoundError, ConflictError } = require("./db");

// ── Books ──────────────────────────────────────────────

function listBooks(req, res) {
  const { author } = req.query;

  let result = db.books;
  if (author) {
    result = result.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  res.json(result);
}

function getBook(req, res, next) {
  const id = Number(req.params.id);
  const book = db.books.find((b) => b.id === id);

  if (!book) {
    return next(new NotFoundError("Livro não encontrado"));
  }

  res.json(book);
}

function createBook(req, res) {
  const { title, author, isbn, copies } = req.body;
  const book = db.createBook({ title, author, isbn, copies });
  res.status(201).json(book);
}

function updateBook(req, res, next) {
  const id = Number(req.params.id);
  const book = db.books.find((b) => b.id === id);

  if (!book) {
    return next(new NotFoundError("Livro não encontrado"));
  }

  const { title, author, isbn, copies } = req.body;

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (isbn !== undefined) book.isbn = isbn;
  if (copies !== undefined) {
    const diff = copies - book.copies;
    book.copies = copies;
    book.availableCopies = Math.max(0, book.availableCopies + diff);
  }

  res.json(book);
}

function deleteBook(req, res, next) {
  const id = Number(req.params.id);
  const index = db.books.findIndex((b) => b.id === id);

  if (index === -1) {
    return next(new NotFoundError("Livro não encontrado"));
  }

  db.books.splice(index, 1);
  res.status(204).send();
}

// ── Users ──────────────────────────────────────────────

function listUsers(req, res) {
  res.json(db.users);
}

function getUser(req, res, next) {
  const id = Number(req.params.id);
  const user = db.users.find((u) => u.id === id);

  if (!user) {
    return next(new NotFoundError("Usuário não encontrado"));
  }

  res.json(user);
}

function createUser(req, res, next) {
  const { name, email } = req.body;

  const emailTaken = db.users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (emailTaken) {
    return next(new ConflictError("Já existe um usuário com este email"));
  }

  const user = db.createUser({ name, email });
  res.status(201).json(user);
}

function deleteUser(req, res, next) {
  const id = Number(req.params.id);
  const index = db.users.findIndex((u) => u.id === id);

  if (index === -1) {
    return next(new NotFoundError("Usuário não encontrado"));
  }

  db.users.splice(index, 1);
  res.status(204).send();
}

// ── Loans ──────────────────────────────────────────────

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
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  listUsers,
  getUser,
  createUser,
  deleteUser,
  listLoans,
  createLoan,
  returnLoan,
};
