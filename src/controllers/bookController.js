const db = require("../data/db");
const { NotFoundError } = require("../utils/errors");

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

module.exports = {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
