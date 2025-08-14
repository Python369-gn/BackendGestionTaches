import User from '../models/User.js';
import Task from '../models/Task.js';

// Users CRUD (admin)
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Champs requis manquants' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });
  const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'member' });
  res.status(201).json(user);
};

// GET public : retourne tous les utilisateurs sans authentification
export const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// GET public : retourne un utilisateur par son ID sans authentification
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const { name, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  if (name) user.name = name;
  if (role) user.role = role === 'admin' ? 'admin' : 'member';
  await user.save();
  const safe = user.toObject(); delete safe.password;
  res.json(safe);
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  await Task.deleteMany({ owner: user._id });
  res.json({ message: 'Utilisateur et tâches associées supprimés' });
};

// Tasks CRUD (admin on all tasks)
export const createTaskAdmin = async (req, res) => {
  const { title, description, priority, status, owner } = req.body;
  if (!title || !owner) return res.status(400).json({ message: 'title et owner requis' });
  const task = await Task.create({ title, description, priority, status, owner });
  res.status(201).json(task);
};

export const getTasksAdmin = async (req, res) => {
  const { page = 1, limit = 10, status, priority, owner } = req.query;
  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (owner) query.owner = owner;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Task.find(query).populate('owner', 'name email role').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Task.countDocuments(query)
  ]);
  res.json({ page: Number(page), limit: Number(limit), total, items });
};

export const getTaskByIdAdmin = async (req, res) => {
  const task = await Task.findById(req.params.id).populate('owner', 'name email role');
  if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
  res.json(task);
};

export const updateTaskAdmin = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
  res.json(task);
};

export const deleteTaskAdmin = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
  res.json({ message: 'Tâche supprimée' });
};

// GET public : dashboard admin sans authentification
export const adminDashboard = async (req, res) => {
  const [users, tasks] = await Promise.all([
    User.find().select('-password').sort({ createdAt: -1 }),
    Task.find().populate('owner', 'name email').sort({ createdAt: -1 }).limit(50)
  ]);
  const usersRows = users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`).join('');
  const tasksRows = tasks.map(t => `<tr><td>${t.title}</td><td>${t.status}</td><td>${t.priority}</td><td>${t.owner?.name || '-'}</td></tr>`).join('');
  res.send(`
    <html><head><meta charset="utf-8"><title>Admin Dashboard</title>
    <style>
      body{font-family:Arial, sans-serif; margin:20px}
      h1{margin-bottom:8px}
      table{border-collapse:collapse; width:100%; margin-bottom:24px}
      th,td{border:1px solid #ddd; padding:8px; font-size:14px}
      th{background:#f2f2f2; text-align:left}
      .hint{color:#666; font-size:13px}
    </style></head><body>
      <h1>Admin Dashboard</h1>
      <p class="hint">Endpoints API: /admin/users, /admin/tasks, /auth/login, /auth/register</p>
      <h2>Utilisateurs</h2>
      <table><thead><tr><th>Nom</th><th>Email</th><th>Rôle</th></tr></thead><tbody>${usersRows}</tbody></table>
      <h2>Dernières tâches</h2>
      <table><thead><tr><th>Titre</th><th>Statut</th><th>Priorité</th><th>Propriétaire</th></tr></thead><tbody>${tasksRows}</tbody></table>
    </body></html>
  `);
};
