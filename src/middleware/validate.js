const { ValidationError } = require("../utils/errors");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateBookPayload(req, res, next) {
  const { title, author, isbn, copies } = req.body;

  if (!isNonEmptyString(title)) {
    return next(new ValidationError("O campo 'title' é obrigatório"));
  }
  if (!isNonEmptyString(author)) {
    return next(new ValidationError("O campo 'author' é obrigatório"));
  }
  if (!isNonEmptyString(isbn)) {
    return next(new ValidationError("O campo 'isbn' é obrigatório"));
  }
  if (!Number.isInteger(copies) || copies < 1) {
    return next(
      new ValidationError("O campo 'copies' deve ser um inteiro maior que zero")
    );
  }

  next();
}

function validateUserPayload(req, res, next) {
  const { name, email } = req.body;

  if (!isNonEmptyString(name)) {
    return next(new ValidationError("O campo 'name' é obrigatório"));
  }
  if (!isValidEmail(email)) {
    return next(new ValidationError("O campo 'email' é inválido"));
  }

  next();
}

function validateLoanPayload(req, res, next) {
  const { bookId, userId } = req.body;

  if (!Number.isInteger(bookId)) {
    return next(new ValidationError("O campo 'bookId' é obrigatório"));
  }
  if (!Number.isInteger(userId)) {
    return next(new ValidationError("O campo 'userId' é obrigatório"));
  }

  next();
}

module.exports = {
  validateBookPayload,
  validateUserPayload,
  validateLoanPayload,
};
