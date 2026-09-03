let nextBookId = 1;
let nextUserId = 1;
let nextLoanId = 1;

const books = [];
const users = [];
const loans = [];

function createBook({ title, author, isbn, copies }) {
  const book = {
    id: nextBookId++,
    title,
    author,
    isbn,
    copies,
    availableCopies: copies,
  };
  books.push(book);
  return book;
}

function createUser({ name, email }) {
  const user = {
    id: nextUserId++,
    name,
    email,
  };
  users.push(user);
  return user;
}

function createLoan({ bookId, userId }) {
  const loan = {
    id: nextLoanId++,
    bookId,
    userId,
    borrowedAt: new Date().toISOString(),
    returnedAt: null,
  };
  loans.push(loan);
  return loan;
}

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "Dados inválidos") {
    super(message, 400);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflito com o estado atual do recurso") {
    super(message, 409);
  }
}

module.exports = {
  books,
  users,
  loans,
  createBook,
  createUser,
  createLoan,
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
};
