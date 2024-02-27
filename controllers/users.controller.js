const User = require("../models/user.model");
const mongoose = require('mongoose');
const { sessions } = require('../middlewares/auth.middleware')


module.exports.create = (req, res, next) => res.render('user/signup');

module.exports.doCreate = (req, res, next) => {
  const user = { email: req.body.email, password: req.body.password};

    User.create(user)
      .then((user) => res.redirect('/login'))
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(400).render('user/signup', {user, errors: error.errors});
        } else {
          next(error);
        }
    });
};

module.exports.profile = (req, res, next) => {
  res.render("user/profile");
}

module.exports.edit = (req, res, next) => {
    const { id } = req.params;
    User.findById(id)
        .then((user) => res.render('user/edit', { user }))
        .catch((error) => next(error));
}

module.exports.doEdit = ( req, res, next) => {
  const user =  {name: req.body.name, age:req.body.age, email: req.body.email};
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

module.exports.login = (req, res, next) => {
  res.render('user/login')
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      user.checkPassword(req.body.password).then((match) => {
        if(match) {
          const sessionId = Math.random().toString(36).substring(2, 15);
          sessions.push({ sessionId, userId: user.id});

          res.setHeader('Set-Cookie', `sessionId=${sessionId};`);
          res.redirect('/');

          if(!sessionId) {
            console.log('Usuario anónimo')
          } else {
            console.log(`${user.email}`)
            console.log(`${sessionId}`)
          }
          
        } else {
          res.redirect('/login')
        }
      })
    })
    .catch(next)
}