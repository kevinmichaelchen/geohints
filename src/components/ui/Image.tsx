import { component$, useSignal } from "@builder.io/qwik";

interface OptimizedImageProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  class?: string;
  loading?: "eager" | "lazy";
  sizes?: string;
  formats?: ("webp" | "avif" | "jpg" | "png")[];
  quality?: number;
  [key: string]: any; // For any additional HTML attributes
}

export const OptimizedImage = component$<OptimizedImageProps>(
  ({
    src,
    width,
    height,
    alt,
    class: className = "",
    loading = "lazy",
    sizes = "(max-width: 768px) 100vw, 50vw",
    formats = ["webp", "avif"],
    quality = 80,
    ...props
  }) => {
    const imgRef = useSignal<HTMLImageElement>();

    // Generate srcset for different formats
    const generateSrcSet = (format: string) => {
      const densities = [1, 2, 3];
      return densities
        .map((density) => {
          const w = Math.round(width * density);
          const h = Math.round(height * density);
          return `${src}?w=${w}&h=${h}&format=${format}&quality=${quality} ${density}x`;
        })
        .join(", ");
    };

    // Generate srcset for the img element
    const imgSrcSet = formats
      .map((format) => `${generateSrcSet(format)}`)
      .join(", ");

    // Generate source elements for picture
    const sources = formats.map((format) => (
      <source
        key={format}
        type={`image/${format}`}
        srcset={generateSrcSet(format)}
        sizes={sizes}
      />
    ));

    // Generate the base image URL
    const imgUrl = `${src}?w=${width}&h=${height}&format=webp&quality=${quality}`;

    return (
      <picture>
        {sources}
        <img
          ref={imgRef}
          src={imgUrl}
          width={width}
          height={height}
          alt={alt}
          class={className}
          loading={loading}
          decoding="async"
          {...props}
        />
      </picture>
    );
  },
);
