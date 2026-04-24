import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(key, { apiVersion: '2024-06-20' });
};

export const createCheckoutSession = async (req, res) => {
  const stripe = getStripe();
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (order.isPaid) return res.status(400).json({ message: 'Order already paid' });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: req.user.email,
    line_items: order.items.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(i.price * 100),
        product_data: {
          name: i.name,
          images: i.image ? [i.image] : [],
        },
      },
    })),
    shipping_options:
      order.shippingPrice > 0
        ? [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: Math.round(order.shippingPrice * 100), currency: 'usd' },
                display_name: 'Standard Shipping',
              },
            },
          ]
        : [],
    metadata: { orderId: order._id.toString() },
    success_url: `${clientUrl}/orders/${order._id}?success=1`,
    cancel_url: `${clientUrl}/orders/${order._id}?canceled=1`,
  });

  res.json({ url: session.url, id: session.id });
};

// Expects raw body (set up in index.js)
export const stripeWebhook = async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'paid';
        order.paymentResult = {
          id: session.payment_intent,
          status: session.payment_status,
          email: session.customer_details?.email,
        };
        await order.save();

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
        }
      }
    }
  }

  res.json({ received: true });
};
