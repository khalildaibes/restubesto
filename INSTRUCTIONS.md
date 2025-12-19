# Project Instructions & Architecture

## 📁 Project Structure

This project follows enterprise conventions with a feature-based architecture.

```
restubesto/
├── app/                          # Next.js App Router
│   ├── (home)/                  # Home feature group
│   │   └── page.tsx
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── features/                     # Feature-based modules
│   ├── cart/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── meals/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── categories/
│   │   ├── components/
│   │   └── hooks/
│   └── promotions/
│       └── components/
│
├── shared/                       # Shared across features
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Basic UI primitives
│   │   └── layout/             # Layout components
│   ├── hooks/                   # Shared hooks
│   ├── utils/                   # Utility functions
│   └── constants/               # Constants
│
├── stores/                       # State management
│   ├── cart/
│   └── language/
│
├── types/                        # TypeScript types
│   ├── domain/                  # Domain models
│   └── api/                     # API types
│
├── config/                       # Configuration files
│   ├── tailwind.config.ts
│   └── next.config.js
│
└── lib/                          # Legacy (to be migrated)
```

## 🎯 Principles

1. **File Size Limit**: **No file exceeds 50 lines** - This is strictly enforced
2. **Single Responsibility**: Each file has one clear purpose
3. **Feature-Based**: Group related functionality by feature domain
4. **Shared Resources**: Common code in `shared/` directory
5. **Type Safety**: All types in `types/` directory with proper exports
6. **Component Composition**: Break large components into smaller sub-components
7. **Hook Extraction**: Extract reusable logic into custom hooks
8. **Index Exports**: Use `index.ts` files for clean imports

## 📝 Naming Conventions

- **Components**: PascalCase (e.g., `MealCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useMealDetails.ts`)
- **Utils**: camelCase (e.g., `formatPrice.ts`)
- **Types**: PascalCase (e.g., `Meal.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Folders**: camelCase for features, kebab-case for shared

## 🔧 Component Structure

Each component folder follows this pattern:
```
ComponentName/
├── ComponentName.tsx      # Main component (< 50 lines)
├── ComponentSubPart.tsx   # Sub-components if needed
├── hooks/                 # Component-specific hooks
└── index.ts              # Export barrel
```

## 🔄 Migration Guide

When adding new features:
1. Create feature folder in `features/[feature]/`
2. Add components in `features/[feature]/components/`
3. Extract hooks to `features/[feature]/components/[Component]/hooks/` or `shared/hooks/`
4. Define types in `types/domain/` or `types/[feature]/`
5. Share common code via `shared/`
6. Keep each file under 50 lines - split if needed

## 📦 Import Examples

```typescript
// Feature components
import { MealCard } from '@/features/meals/components/MealCard'
import { CartDrawer } from '@/features/cart/components/CartDrawer'

// Shared components
import { Button } from '@/shared/components/ui/Button'
import { Header } from '@/shared/components/layout/Header'

// Stores
import { useCartStore } from '@/stores/cart'
import { useLanguageStore } from '@/stores/language'

// Types
import type { Meal } from '@/types/domain'
import type { Language } from '@/types/i18n'

// Utils
import { getText } from '@/shared/utils/i18n'
import { cn } from '@/shared/utils/cn'

// Data
import { meals, categories } from '@/data/mock'
```

## 🚀 Development Workflow

1. **Feature Development**: Work within feature folders
2. **Shared Components**: Add to `shared/components/ui/`
3. **State Management**: Use stores in `stores/`
4. **Types**: Define in appropriate `types/` subdirectory

## 📦 Import Paths

Use absolute imports with `@/` prefix:
- `@/features/cart/components/CartDrawer`
- `@/shared/components/ui/Button`
- `@/stores/cart/cartStore`
- `@/types/domain/Meal`

## 🧪 Testing Structure

Tests mirror source structure:
- `features/cart/components/__tests__/`
- `shared/hooks/__tests__/`

## 📚 Documentation

- Component documentation in JSDoc comments
- Feature READMEs in feature folders
- API documentation in `docs/`

