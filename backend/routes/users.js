const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

// Ruta pentru înregistrarea unui nou utilizator
router.post('/register', usersController.register);

// Ruta pentru autentificarea utilizatorilor
router.post('/login', usersController.login);

// Ruta pentru obținerea tuturor utilizatorilor
router.get('/', usersController.getAllUsers);

// Ruta pentru obținerea unui singur utilizator prin ID
router.get('/:userId', usersController.getUserById);

// Ruta pentru actualizarea unui utilizator
router.put('/:userId', usersController.updateUser);

// Ruta pentru ștergerea unui utilizator
router.delete('/:userId', usersController.deleteUser);
// În fișierul de rute pentru utilizatori

module.exports = router;
