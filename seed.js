import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Task from './src/models/Task.js';

const run = async () => {
  await connectDB();

  // Clean
  await Task.deleteMany({});
  await User.deleteMany({});

  // Create users
  const admin = await User.create({ name: 'fawzane', email: 'fawzane@gmail.com', password: 'fawzane', role: 'admin' });
  const dalanda = await User.create({ name: 'dalanda', email: 'dalanda@gmail.com', password: 'dalanda', role: 'member' });
  const hadiatou = await User.create({ name: 'hadiatou', email: 'hadiatou@gmail.com', password: 'hadiatou', role: 'member' });
  const oumar = await User.create({ name: 'oumar', email: 'oumar@gmail.com', password: 'oumar', role: 'member' });
  // Create tasks
  const tasks = await Task.insertMany([
    { title: 'Configurer MongoDB Atlas', description: 'Créer cluster et user', priority: 'high', status: 'in_progress', owner: admin._id },
    { title: 'Écrire README', description: 'Doc courte', priority: 'medium', status: 'todo', owner: dalanda._id },
    { title: 'Mettre en place un projet', description: 'Lint + tests', priority: 'low', status: 'todo', owner: hadiatou._id },
    { title: 'Créer routes /admin', description: 'CRUD users & tasks', priority: 'high', status: 'done', owner: admin._id },

    { title: 'Créer dashboard HTML', description: 'Dashboard simple pour /admin et /user', priority: 'low', status: 'todo', owner: oumar._id }

  ]);

  console.log('✅ Seed terminé');
  console.log('Admin login -> email: fawzane@gmail.com | password: fawzane');
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
