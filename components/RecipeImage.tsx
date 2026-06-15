import Image from "next/image";
import { canUseNextImage } from "@/lib/images";

type Props = {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  sizes?: string;
  loading?: "eager" | "lazy";
};

export default function RecipeImage({ src, alt, className, width, height, sizes, loading = "lazy" }: Props) {
  if (canUseNextImage(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        loading={loading}
      />
    );
  }

  return (
    // User-submitted image hosts are not all configured for next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
    />
  );
}
