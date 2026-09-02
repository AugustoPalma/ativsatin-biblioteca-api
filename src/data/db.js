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

module.exports = {
  books,
  users,
  loans,
  createBook,
  createUser,
  createLoan,
};
