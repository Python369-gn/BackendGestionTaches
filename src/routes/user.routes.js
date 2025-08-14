import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import {
  createTask, getTasks, getTaskById, updateTask, deleteTask, userDashboard
} from '../controllers/user.controller.js';

const router = Router();

// Dashboard HTML (PUBLIC : accessible sans authentification)
// Pour restreindre l'accès, ajouter authorize('member', 'admin')
router.get('/dashboard', userDashboard);

// Member tasks (CRUD)
router.post('/tasks', protect, authorize('member', 'admin'), createTask);
// GET /tasks et /tasks/:id sont maintenant PUBLICS : accessibles sans authentification
// Pour restreindre l'accès, ajouter authorize('member', 'admin')
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', protect, authorize('member', 'admin'), updateTask);
router.delete('/tasks/:id', protect, authorize('member', 'admin'), deleteTask);

export default router;
