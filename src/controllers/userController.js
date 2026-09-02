const db = require("../data/db");
const { NotFoundError, ConflictError } = require("../utils/errors");

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

module.exports = {
  listUsers,
  getUser,
  createUser,
  deleteUser,
};
