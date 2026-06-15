import { imageFileToDataUrl } from "@/lib/recipeImageUpload";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("image");

  if (!(file instanceof File)) {
    return Response.json({ ok: false, errors: ["Choose an image file to upload."] }, { status: 400 });
  }

  const result = await imageFileToDataUrl(file);

  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  return Response.json({ ok: true, imageUrl: result.imageUrl });
}
