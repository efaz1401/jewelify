import Category from '../models/Category.js';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const listCategories = async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories });
};

export const createCategory = async (req, res) => {
  const { name, description, image } = req.body;
  const slug = slugify(name);
  if (await Category.exists({ slug })) return res.status(400).json({ message: 'Category already exists' });
  const category = await Category.create({ name, slug, description, image });
  res.status(201).json({ category });
};

export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  const { name, description, image } = req.body;
  if (name) {
    category.name = name;
    category.slug = slugify(name);
  }
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  await category.save();
  res.json({ category });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Deleted' });
};
