// File: src/api/media/index.ts
import API from "../axios";
import type { MediaResponse } from "./types";

// ① Uploadbestand: (identieke functienaam blijft)
export const uploadFile = async (
  file: File,
  alt: string,
  type: "img" | "video" | "files" = "files",
  styles = ""
): Promise<MediaResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("alt", alt);
  formData.append("type", type);
  formData.append("styles", styles);

  const res = await API.post<MediaResponse>("/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ② Lijst alle media
export const getUploads = async (): Promise<MediaResponse[]> => {
  const res = await API.get<MediaResponse[]>("/media");
  return res.data;
};

// ③ Verwijder één item
export const deleteUpload = async (id: string): Promise<void> => {
  await API.delete(`/media/${id}`);
};
