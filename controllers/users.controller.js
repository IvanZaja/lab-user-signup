const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


module.exports.create = (req, res, next) => res.render('user/signup');

module.exports.doCreate = (req, res, next) => {
  const user = {name: req.body.name, age:req.body.age, mail: req.body.email, password: req.body.password};
  const { id } = req.params;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({ name: req.body.name, age:req.body.age, email: req.body.email, password: hash})
        .then((user) => res.redirect(`/profile/${user.id}`))
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).render('user/signup', {user, errors: error.errors});
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

module.exports.profile = (req, res, next) => {
    const { id } = req.params;
    User.findById(id)
        .then((user) => res.render('user/profile', { user }))
        .catch((error) => next(error))
}

module.exports.edit = (req, res, next) => {
    const { id } = req.params;
    User.findById(id)
        .then((user) => res.render('user/edit', { user }))
        .catch((error) => next(error));
}

module.exports.doEdit = ( req, res, next) => {
  const user =  {name: req.body.name, age:req.body.age, mail: req.body.email};
  const { id } = req.params;
  User.findByIdAndUpdate(id, user, { runValidators: true })
    .then ((user) => res.redirect(`/profile/${user.id}`), { user })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render('user/edit', {user, errors: error.errors});
      } else {
        next(error);
      }
    });
}

module.exports.delete = (req, res, next) => {
    const { id } = req.params;
    User.findByIdAndDelete(id)
        .then(() => res.redirect('/'))
        .catch((error) => next(error))
}