# Image Optimization in Geohints

This document outlines the image optimization setup used in the Geohints project.

## Features

- **Automatic Format Conversion**: Automatically serves images in modern formats (WebP, AVIF) with fallbacks
- **Responsive Images**: Generates multiple sizes for different device resolutions
- **Lazy Loading**: Images are lazy-loaded by default for better performance
- **Optimized Caching**: Proper cache headers for optimal CDN and browser caching

## Usage

### Basic Usage

Use the `OptimizedImage` component for all images in your application:

```tsx
import { OptimizedImage } from "~/components/ui/Image";

// In your component:
<OptimizedImage
  src="/path/to/image.jpg"
  width={800}
  height={600}
  alt="Description of image"
  class="custom-classes"
  formats={["webp", "avif"]}
  quality={80}
/>;
```

### Props

| Prop    | Type              | Default                          | Description                           |
| ------- | ----------------- | -------------------------------- | ------------------------------------- |
| src     | string            | -                                | The source path to the image          |
| width   | number            | -                                | The width of the image (in pixels)    |
| height  | number            | -                                | The height of the image (in pixels)   |
| alt     | string            | -                                | Alternative text for the image        |
| class   | string            | ''                               | Additional CSS classes                |
| loading | 'lazy' \| 'eager' | 'lazy'                           | Loading behavior                      |
| sizes   | string            | '(max-width: 768px) 100vw, 50vw' | Sizes attribute for responsive images |
| formats | string[]          | ['webp', 'avif']                 | Image formats to generate             |
| quality | number            | 80                               | Image quality (0-100)                 |

## How It Works

1. **Image Processing**:

   - Images are processed on-the-fly using `vite-imagetools`
   - Multiple resolutions are generated for different device pixel ratios (1x, 2x, 3x)
   - Images are converted to modern formats (WebP, AVIF) with fallbacks

2. **Responsive Images**:

   - The `sizes` attribute ensures the browser downloads the most appropriate image size
   - The `srcset` attribute provides multiple image sources for different resolutions

3. **Performance Optimizations**:
   - Lazy loading by default
   - Proper cache headers for optimal CDN and browser caching
   - Efficient image format selection based on browser support

## Adding New Images

1. Place your images in the `public/images` directory
2. Reference them in your components using the `OptimizedImage` component
3. Always specify the `width` and `height` to prevent layout shifts
4. Provide meaningful `alt` text for accessibility

## Development

In development mode, images are processed on-demand. For production builds, images are optimized during the build process.

## Deployment

When deploying, ensure your CDN is configured to respect the cache headers set by the application. The default cache time is set to 1 year for immutable assets.
