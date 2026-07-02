/**
 * Optimizes a Cloudinary image URL with auto quality, format, and size.
 * Falls back to the original URL if it's not a Cloudinary URL.
 */
export function imgUrl(src, { width = 600 } = {}) {
  if (!src) return '';
  if (src.startsWith('http') && src.includes('cloudinary.com')) {
    return src.replace('/upload/', `/upload/q_auto,f_auto,w_${width},c_limit/`);
  }
  // Local dev — Cloudinary public_id format (no http)
  if (!src.startsWith('http') && src.length > 0) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (cloudName) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto,w_${width},c_limit/${src}`;
    }
  }
  return src;
}
