import User from '../models/User.js';
import { signToken, sendTokenCookie } from '../utils/token.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  sendTokenCookie(res, token);
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = signToken(user._id);
  sendTokenCookie(res, token);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const logout = async (_req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      address: req.user.address,
    },
  });
};

export const updateProfile = async (req, res) => {
  const { name, address, password } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (name) user.name = name;
  if (address) user.address = { ...user.address?.toObject?.(), ...address };
  if (password) user.password = password;
  await user.save();
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address },
  });
};
