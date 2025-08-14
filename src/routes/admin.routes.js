import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import {
  createUser, getUsers, getUserById, updateUser, deleteUser,
  createTaskAdmin, getTasksAdmin, getTaskByIdAdmin, updateTaskAdmin, deleteTaskAdmin,
  adminDashboard
} from '../controllers/admin.controller.js';

const router = Router();

// Dashboard HTML (PUBLIC : accessible sans authentification)
// Pour restreindre l'accès, ajouter authorize('admin')
router.get('/dashboard', adminDashboard);

// Users CRUD
router.post('/users', protect, authorize('admin'), createUser);
// GET /users est PUBLIC : accessible sans authentification
// Pour restreindre l'accès, ajouter authorize('admin')
router.get('/users', getUsers);
// GET /users/:id est PROTEGEE (admin uniquement)
router.get('/users/:id', authorize('admin'), getUserById);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Tasks CRUD (all tasks)
router.post('/tasks', protect, authorize('admin'), createTaskAdmin);
// GET /tasks et /tasks/:id sont maintenant PUBLICS : accessibles sans authentification
// Pour restreindre l'accès, ajouter protect et authorize('admin')
router.get('/tasks', getTasksAdmin);
router.get('/tasks/:id', getTaskByIdAdmin);
router.put('/tasks/:id', protect, authorize('admin'), updateTaskAdmin);
router.delete('/tasks/:id', protect, authorize('admin'), deleteTaskAdmin);

export default router;
