const express = require("express");
const users = require("../controllers/users.controller");
const home = require("../controllers/home.controller");
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router();
// Home
router.get("/", home.home);

// Create
router.get('/signup', users.create);
router.post('/signup', users.doCreate);

// Login 
router.get('/login', users.login);
router.post('/login', users.doLogin);

// Read
router.get('/profile', authMiddleware.isAuthenticated, users.profile);
// Update
router.get('/user/:id/edit', authMiddleware.isAuthenticated, users.edit);
router.post('/user/:id/edit', authMiddleware.isAuthenticated, users.doEdit);
// Delete
router.post('/user/:id/delete', authMiddleware.isAuthenticated, users.delete);


module.exports = router;
