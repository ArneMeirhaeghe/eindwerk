// src/api/files.ts
import axios from "./axios";

export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const resp = await axios.post<{ url: string }>(
    "/files/upload",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return resp.data.url;
}
