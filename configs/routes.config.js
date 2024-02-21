const express = require("express");
const users = require("../controllers/users.controller");
const home = require("../controllers/home.controller");

const router = express.Router();
// Home
router.get("/", home.home);
// Create
router.get('/signup', users.create);
router.post('/signup', users.doCreate);
// Read
router.get('/profile/:id', users.profile);
// Update
router.get('/user/:id/edit', users.edit);
router.post('/user/:id/edit', users.doEdit);
// Delete
router.post('/user/:id/delete', users.delete);


module.exports = router;
