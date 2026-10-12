// Display prices in Bangladeshi Taka.
// IMPORTANT: enter taka amounts directly in the admin panel / database
// (e.g. 290 for a ৳290 pair) — no currency conversion happens here.
export const formatPrice = (value) => `৳${Math.round(Number(value) || 0).toLocaleString('en-IN')}`;

// Delivery pricing for Bangladesh (must match server/src/controllers/orderController.js)
export const FREE_DELIVERY_THRESHOLD = 999; // ৳ — free delivery above this
export const DELIVERY_FEE = 60; // ৳ — standard courier inside Dhaka/outside Dhaka
