import { File, Directory, Paths } from "expo-file-system";
import { validatePhoto, type LocalPhoto } from "../features/identity/model";
const directory = () => new Directory(Paths.document, "snowmate-demo-photos");
export async function saveLocalPhoto(
  uri: string,
  mimeType: string,
): Promise<LocalPhoto> {
  const source = new File(uri),
    bytes = await source.bytes();
  const error = validatePhoto(bytes, mimeType);
  if (error) throw new Error(error);
  directory().create({ idempotent: true, intermediates: true });
  const id = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const extension =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : "jpg";
  const target = new File(directory(), `${id}.${extension}`);
  source.copy(target);
  return {
    id,
    uri: target.uri,
    mimeType,
    bytes: bytes.length,
    status: "local",
  };
}
export async function resolvePhoto(photo: LocalPhoto) {
  return photo.uri.startsWith(directory().uri) && new File(photo.uri).exists
    ? photo.uri
    : null;
}
export async function deletePhoto(photo: LocalPhoto) {
  const file = new File(photo.uri);
  if (file.exists && file.uri.startsWith(directory().uri)) file.delete();
}
