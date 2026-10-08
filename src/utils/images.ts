import path from 'node:path';
import sharp from 'sharp';

const imageDimensionCache = new Map<string, { width?: number; height?: number }>();

/** 读取图片尺寸并缓存，避免构建时重复 I/O。 */
async function getImageDimensions(imagePath: string): Promise<{ width?: number; height?: number }> {
  if (imageDimensionCache.has(imagePath)) {
    return imageDimensionCache.get(imagePath)!;
  }

  try {
    const metadata = await sharp(imagePath).metadata();
    const result = { width: metadata.width, height: metadata.height };
    imageDimensionCache.set(imagePath, result);
    return result;
  } catch {
    return {};
  }
}

/** 根据 public 路径或绝对路径获取图片尺寸。 */
export async function getImageDimensionsFromSrc(src: string): Promise<{ width?: number; height?: number }> {
  if (!src.startsWith('/')) return {};
  const imagePath = path.join(process.cwd(), 'public', src);
  return getImageDimensions(imagePath);
}
