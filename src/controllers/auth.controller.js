import User from '../models/User.js';
import { signToken } from '../utils/token.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Champs requis manquants' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email déjà utilisé' });
  const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'member' });
  const token = signToken(user);
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ message: 'Identifiants invalides' });
  const token = signToken(user);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};
