# Sushi-na Restaurant Menu

A simple, sleek restaurant menu web app built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Header** with cart button showing item count
- **Promotion Banner** with auto-rotating promotions
- **Category Cards** displayed in a grid layout
- **Category Pages** showing meals for each category
- **Meal Detail Modal** with quantity selector and add to cart
- **Cart Drawer** with item management and checkout

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (State Management)

## Project Structure

```
├── app/
│   ├── category/[slug]/  # Category meals page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── Header.tsx         # Header with cart button
│   ├── PromotionBanner.tsx # Promotion carousel
│   ├── CategoryCard.tsx   # Individual category card
│   ├── CategoryGrid.tsx   # Category grid layout
│   ├── MealCard.tsx       # Individual meal card
│   ├── MealDetailModal.tsx # Meal detail modal
│   └── CartDrawer.tsx     # Shopping cart drawer
└── lib/
    ├── mockData.ts        # Mock data for banners, categories, meals
    └── cartStore.ts       # Zustand cart store
```

