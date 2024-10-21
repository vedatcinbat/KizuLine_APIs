import { Router } from 'express';
import { AppDataSource } from '../ormconfig';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

interface JwtPayload {
  id: number;
}

// Test Endpoint
router.get('/', async (req, res) => {
  res.status(201).json({ message: 'Welcome to the user routes' });
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepo.create({ username, email, password: hashedPassword });
    await userRepo.save(newUser);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id } as unknown as JwtPayload, 'your_jwt_secret');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

export default router;
