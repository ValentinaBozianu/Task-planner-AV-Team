const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/taskController');

// Ruta pentru crearea unui task nou
router.post('/', tasksController.createTask);

// Ruta pentru obținerea tuturor task-urilor
router.get('/', tasksController.getTasks);

// Ruta pentru obținerea unui task specific prin ID
router.get('/:taskId', tasksController.getTaskById);

// Ruta pentru actualizarea unui task
router.put('/:taskId', tasksController.updateTask);

// Ruta pentru ștergerea unui task
router.delete('/:taskId', tasksController.deleteTask);

// Ruta pentru schimbarea stării unui task
router.patch('/:taskId/status', tasksController.changeTaskStatus);

module.exports = router;
