# Landing Page - Design

## Overview

The landing page serves as the entry point to GeoHints, providing immediate value communication and navigation to all features.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                      Header                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                    Hero Section                          │
│         Logo + Headline + Subheadline                   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                 Category Grid                            │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│    │Languages│  │ Follow  │  │Analyze │               │
│    │         │  │  Cars   │  │  Text   │               │
│    └─────────┘  └─────────┘  └─────────┘               │
│                                                          │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│    │ Domains │  │Driving  │  │ Camera  │  (Coming     │
│    │  (soon) │  │  Side   │  │  Gens   │   Soon)      │
│    └─────────┘  └─────────┘  └─────────┘               │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                      Footer                              │
└─────────────────────────────────────────────────────────┘
```

## Component Design

### Hero Component (`src/components/features/Hero.tsx`)

```typescript
import { component$ } from '@builder.io/qwik';
import Logo from '~/media/logo.svg?jsx';

export default component$(() => {
  return (
    <section class="container mx-auto px-4 py-16 text-center">
      <Logo class="mx-auto h-20 w-auto mb-8" />
      <h1 class="text-4xl md:text-6xl font-bold mb-4">
        Master <span class="text-[var(--qwik-light-blue)]">GeoGuessr</span> with Visual Clues
      </h1>
      <p class="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
        Learn to identify countries by language characters, follow cars, road signs, and more.
      </p>
    </section>
  );
});
```

### CategoryCard Component (`src/components/ui/CategoryCard.tsx`)

```typescript
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Image } from '@unpic/qwik';

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  comingSoon?: boolean;
}

export const CategoryCard = component$<CategoryCardProps>(
  ({ title, description, href, imageSrc, comingSoon = false }) => {
    const CardWrapper = comingSoon ? 'div' : Link;

    return (
      <CardWrapper
        href={comingSoon ? undefined : href}
        class={[
          'block rounded-xl overflow-hidden bg-[var(--qwik-dirty-black)] transition-transform',
          comingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl',
        ]}
      >
        <div class="aspect-video relative">
          <Image
            src={imageSrc}
            layout="fullWidth"
            alt={title}
            class="object-cover w-full h-full"
          />
          {comingSoon && (
            <div class="absolute inset-0 flex items-center justify-center bg-black/50">
              <span class="bg-[var(--qwik-light-purple)] px-3 py-1 rounded-full text-sm font-medium">
                Coming Soon
              </span>
            </div>
          )}
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">{title}</h3>
          <p class="text-gray-400 text-sm">{description}</p>
        </div>
      </CardWrapper>
    );
  }
);
```

### CategoryGrid Component (`src/components/features/CategoryGrid.tsx`)

```typescript
import { component$ } from '@builder.io/qwik';
import { CategoryCard } from '~/components/ui/CategoryCard';

const categories = [
  {
    title: 'Languages',
    description: 'Identify countries by unique alphabet characters',
    href: '/languages',
    imageSrc: '/images/categories/languages.webp',
  },
  {
    title: 'Follow Cars',
    description: 'Recognize Google coverage vehicles by country',
    href: '/follow',
    imageSrc: '/images/categories/follow-cars.webp',
  },
  {
    title: 'Text Analyzer',
    description: 'Paste text to identify possible countries',
    href: '/analyze',
    imageSrc: '/images/categories/analyze.webp',
    comingSoon: true, // Until Spec 04 is complete
  },
  // Future categories...
];

export default component$(() => {
  return (
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-2xl font-semibold mb-8 text-center">Explore Hints</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.href} {...cat} />
        ))}
      </div>
    </section>
  );
});
```

## Image Requirements

### Category Thumbnails

| Category      | Image                              | Source                |
| ------------- | ---------------------------------- | --------------------- |
| Languages     | Character collage or European text | Create/curate         |
| Follow Cars   | Existing Kenya/Nigeria image       | Use existing          |
| Text Analyzer | Text input mockup                  | Create simple graphic |
| Domains       | Browser URL bar with .de/.fr       | Create simple graphic |
| Driving Side  | Split road image L/R               | Curate                |
| Camera Gens   | Google car comparison              | Curate                |

### Image Specifications

- Format: WEBP
- Aspect ratio: 16:9 (for category cards)
- Max width: 800px (will be responsive)
- Optimization: Use Qwik's `?jsx` import or `@unpic/qwik`

## Logo Design

### Requirements

- Works on dark background (#151934)
- Simple, memorable icon
- "GeoHints" wordmark
- SVG format

### Concept Options

1. **Globe + Pin**: Simplified globe with location pin
2. **Magnifying Glass + Map**: Search/discovery theme
3. **Eye + Globe**: Visual clues theme

### Implementation

For MVP, create a simple text-based logo:

```svg
<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="35" font-family="system-ui" font-size="32" font-weight="bold" fill="#18B6F6">
    Geo
  </text>
  <text x="70" y="35" font-family="system-ui" font-size="32" font-weight="bold" fill="#ffffff">
    Hints
  </text>
</svg>
```

Can be enhanced later with a proper icon.

## Responsive Behavior

### Breakpoints

- **Mobile** (< 640px): Single column cards, smaller hero text
- **Tablet** (640px - 1024px): 2-column card grid
- **Desktop** (> 1024px): 3-column card grid

### Mobile Considerations

- Touch-friendly card tap targets (min 44px)
- Reduced padding on mobile
- Stacked hero layout
