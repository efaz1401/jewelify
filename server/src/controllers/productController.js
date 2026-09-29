import Product from '../models/Product.js';
import Category from '../models/Category.js';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const listProducts = async (req, res) => {
  const {
    q,
    category,
    material,
    style,
    minPrice,
    maxPrice,
    discounted,
    featured,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};
  if (q) filter.$text = { $search: q };
  if (material) filter.material = material;
  if (style) filter.style = style;
  if (featured === 'true') filter.featured = true;
  if (discounted === 'true') filter.discountPercent = { $gt: 0 };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
    else return res.json({ products: [], page: 1, pages: 0, total: 0 });
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'rating-desc': { rating: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.newest;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(60, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sortBy).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
};

export const getProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const createProduct = async (req, res) => {
  const { name, description, price, discountPercent, images, category, material, style, stock, featured } = req.body;
  const cat = await Category.findById(category);
  if (!cat) return res.status(400).json({ message: 'Invalid category' });
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let i = 1;
  while (await Product.exists({ slug })) slug = `${baseSlug}-${i++}`;
  const product = await Product.create({
    name,
    slug,
    description,
    price,
    discountPercent,
    images,
    category,
    material,
    style,
    stock,
    featured,
  });
  res.status(201).json({ product });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const updatable = ['name', 'description', 'price', 'discountPercent', 'images', 'category', 'material', 'style', 'stock', 'featured'];
  for (const key of updatable) if (req.body[key] !== undefined) product[key] = req.body[key];
  if (req.body.name && req.body.name !== product.name) {
    const baseSlug = slugify(req.body.name);
    let slug = baseSlug;
    let i = 1;
    while (await Product.exists({ slug, _id: { $ne: product._id } })) slug = `${baseSlug}-${i++}`;
    product.slug = slug;
  }
  await product.save();
  res.json({ product });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Deleted' });
};

export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (already) return res.status(400).json({ message: 'You already reviewed this product' });
  product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ product });
};
