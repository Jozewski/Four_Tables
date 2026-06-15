const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const MAX_RECIPE_IMAGE_UPLOAD_BYTES = 1_500_000;

export type RecipeImageUploadResult =
  | { ok: true; imageUrl: string }
  | { ok: false; errors: string[] };

export async function imageFileToDataUrl(file: File): Promise<RecipeImageUploadResult> {
  const errors: string[] = [];

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    errors.push("Upload must be a JPEG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_RECIPE_IMAGE_UPLOAD_BYTES) {
    errors.push("Upload must be 1.5 MB or smaller.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    ok: true,
    imageUrl: `data:${file.type};base64,${buffer.toString("base64")}`,
  };
}
