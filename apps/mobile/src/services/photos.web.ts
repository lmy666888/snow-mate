import { validatePhoto, type LocalPhoto } from "../features/identity/model";
const urls = new Map<string, string>();
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("snowmate-demo-media-v1", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("photos");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error("Could not open local photo storage."));
  });
}
async function transaction<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("photos", mode),
      request = run(tx.objectStore("photos"));
    tx.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    tx.onerror = () => {
      db.close();
      reject(new Error("Could not save this photo on your device."));
    };
    tx.onabort = tx.onerror;
  });
}
export async function saveLocalPhoto(
  uri: string,
  mimeType: string,
): Promise<LocalPhoto> {
  const response = await fetch(uri),
    blob = await response.blob(),
    bytes = new Uint8Array(await blob.arrayBuffer());
  const error = validatePhoto(bytes, mimeType);
  if (error) throw new Error(error);
  const id = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  await transaction("readwrite", (store) => store.put(blob, id));
  const local = URL.createObjectURL(blob);
  urls.set(id, local);
  return { id, uri: local, mimeType, bytes: bytes.length, status: "local" };
}
export async function resolvePhoto(photo: LocalPhoto) {
  if (urls.has(photo.id)) return urls.get(photo.id)!;
  const blob = await transaction("readonly", (store) => store.get(photo.id));
  if (!(blob instanceof Blob)) return null;
  const uri = URL.createObjectURL(blob);
  urls.set(photo.id, uri);
  return uri;
}
export async function deletePhoto(photo: LocalPhoto) {
  await transaction("readwrite", (store) => store.delete(photo.id));
  const uri = urls.get(photo.id);
  if (uri) URL.revokeObjectURL(uri);
  urls.delete(photo.id);
}
