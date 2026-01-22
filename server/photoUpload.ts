import { storagePut, storageGet } from "./storage";
import { nanoid } from "nanoid";

export async function uploadEmployeePhoto(photoData: string, employeeName: string): Promise<string> {
  try {
    // Converter base64 para buffer
    const base64Data = photoData.split(",")[1] || photoData;
    const buffer = Buffer.from(base64Data, "base64");

    // Gerar nome único para a foto
    const fileName = `employee-${employeeName.replace(/\s+/g, "-")}-${nanoid(8)}.jpg`;
    const fileKey = `photos/${fileName}`;

    // Upload para S3
    const { url } = await storagePut(fileKey, buffer, "image/jpeg");

    return url;
  } catch (error) {
    console.error("[Photo Upload] Error uploading photo:", error);
    throw new Error("Falha ao fazer upload da foto");
  }
}

export async function getEmployeePhotoUrl(photoKey: string): Promise<string> {
  try {
    const { url } = await storageGet(photoKey);
    return url;
  } catch (error) {
    console.error("[Photo Upload] Error getting photo URL:", error);
    throw new Error("Falha ao obter URL da foto");
  }
}

export async function deleteEmployeePhoto(photoKey: string): Promise<void> {
  try {
    // Implementar deleção quando disponível na API de storage
    console.log("[Photo Upload] Photo deletion scheduled:", photoKey);
  } catch (error) {
    console.error("[Photo Upload] Error deleting photo:", error);
  }
}
