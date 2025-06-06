// File: src/api/files/index.ts
import API from "../axios";
import type { GridFsUploadResponse } from "./types";

// POST /api/files/upload
export const uploadGridFsFile = async (
  file: File,
  type: string | null = null,
  alt: string | null = null,
  styles: string | null = null
): Promise<GridFsUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  if (type) formData.append("type", type);
  if (alt) formData.append("alt", alt);
  if (styles) formData.append("styles", styles);

  const res = await API.post<GridFsUploadResponse>(
    "/files/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

// GET /api/files
export const listGridFsFiles = async (): Promise<
  GridFsUploadResponse[]
> => {
  const res = await API.get<GridFsUploadResponse[]>("/files");
  return res.data;
};

// GET /api/files/{id}
export const downloadGridFsFile = async (
  id: string
): Promise<Blob> => {
  const res = await API.get(`/files/${id}`, {
    responseType: "blob",
  });
  return res.data;
};
