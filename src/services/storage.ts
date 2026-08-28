import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function uploadFamilyFile(
  userId: string,
  familyId: string,
  folder: 'photos' | 'documents' | 'avatars',
  file: File
): Promise<string> {
  const path = `users/${userId}/families/${familyId}/${folder}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function uploadDataUrl(
  userId: string,
  familyId: string,
  folder: 'avatars',
  dataUrl: string,
  fileName: string
): Promise<string> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
  return uploadFamilyFile(userId, familyId, folder, file);
}
