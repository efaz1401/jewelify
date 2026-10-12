# Jewelify — Luxury Jewelry E-Commerce Platform

[![Stack](https://img.shields.io/badge/Stack-MERN%20Fullstack-purple.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue.svg)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MongoDB-green.svg)](#)
[![Deployment](https://img.shields.io/badge/Deployment-Render-informational.svg)](#)

> A boutique luxury jewelry e-commerce destination with refined editorial aesthetics, product showcases (rings, necklaces, bracelets, diamonds), persistent shopping cart, and authenticated checkout.

---

## Preview

![Jewelify Boutique Showcase](docs/screenshot.png)

---

## Overview

Jewelify delivers an upscale digital shopping experience tailored for high-end jewelry brands. The project is split into a modular monorepo containing a high-performance React client and an Express REST API backend.

---

## Key Features

- **Luxury Editorial Design**: High-contrast typography, minimalist grid layouts, and gold accent styling.
- **Product Discovery**: Filter by collection (Diamonds, Gold, Gemstones, Rings, Necklaces).
- **Interactive Product Modal & Zoom**: High-resolution jewelry inspection with detailed specifications.
- **Cart & Order Flow**: Full cart state persistence, discount code application, and order summaries.
- **Deployment Ready**: Configured with `render.yaml` and one-click startup scripts (`start-all.bat`).

---

## Tech Stack

- **Client**: React, Vite, Tailwind CSS, Headless UI, Framer Motion
- **Server**: Node.js, Express, MongoDB / Mongoose, JWT Authentication
- **Deployment**: Render Blueprint (`render.yaml`)

---

## Getting Started

### Client Setup
```bash
cd jewelify/client
npm install
npm run dev
```

### Server Setup
```bash
cd jewelify/server
npm install
npm run dev
```

### One-Click Launch (Windows)
```bash
./start-all.bat
```

---

## Project Structure

```
jewelify/
├── docs/
│   └── screenshot.png         # Live boutique screenshot
├── client/                    # React frontend application
│   ├── src/components/        # Header, Hero, Catalog, Cart
│   └── package.json
├── server/                    # Express API & MongoDB models
│   ├── models/                # User, Product, Order schemas
│   ├── routes/                # Auth, Products, Orders API
│   └── server.js
├── render.yaml                # Cloud deployment configuration
└── start-all.bat              # Local startup script
```
