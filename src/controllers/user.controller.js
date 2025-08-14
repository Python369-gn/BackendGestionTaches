import Task from '../models/Task.js';

// Member CRUD on own tasks
export const createTask = async (req, res) => {
  const { title, description, priority, status } = req.body;
  if (!title) return res.status(400).json({ message: 'title requis' });
  const task = await Task.create({ title, description, priority, status, owner: req.user._id });
  res.status(201).json(task);
};

// GET public : retourne toutes les tâches sans filtrer par owner
export const getTasks = async (req, res) => {
  const { page = 1, limit = 10, status, priority } = req.query;
  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Task.countDocuments(query)
  ]);
  res.json({ page: Number(page), limit: Number(limit), total, items });
};

// GET public : retourne la tâche par son ID sans vérifier l'owner
export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
  res.json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });
  if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
  res.json({ message: 'Tâche supprimée' });
};

// GET public : dashboard user sans authentification
export const userDashboard = async (req, res) => {
  const tasks = await Task.find().populate('owner', 'name email').sort({ createdAt: -1 }).limit(50);
  const rows = tasks.map(t => `<tr><td>${t.title}</td><td>${t.status}</td><td>${t.priority}</td><td>${t.owner?.name || '-'}</td></tr>`).join('');
  res.send(`
    <html><head><meta charset="utf-8"><title>User Dashboard</title>
    <style>
      body{font-family:Arial, sans-serif; margin:20px}
      h1{margin-bottom:8px}
      table{border-collapse:collapse; width:100%; margin-top:12px}
      th,td{border:1px solid #ddd; padding:8px; font-size:14px}
      th{background:#f2f2f2; text-align:left}
      .hint{color:#666; font-size:13px}
    </style></head><body>
      <h1>User Dashboard</h1>
      <p class="hint">Vous voyez toutes les tâches (démo). Pour vos propres tâches via API: /user/tasks</p>
      <table><thead><tr><th>Titre</th><th>Statut</th><th>Priorité</th><th>Propriétaire</th></tr></thead><tbody>${rows}</tbody></table>
    </body></html>
  `);
};
