
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Genera un URL di immagine da Sanity in modo sicuro.
 * Se l'immagine è undefined/null ritorna null (per fallback).
 */
export function getImageUrl(
  image: SanityImageSource | null | undefined,
  width: number = 600,
  height: number = 400
): string | null {
  if (!image) return null;
  try {
    return urlFor(image).width(width).height(height).url();
  } catch (err) {
    console.warn("Errore generazione URL immagine:", err);
    return null;
  }
}
